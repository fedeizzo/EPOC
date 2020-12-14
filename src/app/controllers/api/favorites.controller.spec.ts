import { deepEqual, strictEqual } from 'assert';
import { Context, createController, Config, HttpResponse, HttpResponseNotFound, HttpResponseUnauthorized, createService } from '@foal/core';
import { connection, connect, disconnect } from 'mongoose';
import { HttpResponseOK, HttpResponseForbidden, HttpResponseConflict, HttpResponseBadRequest } from '@foal/core';
import { Plan, User, CostLevels } from '../../models';
import { emptyPrefs } from '../../models/preferences.model';
import { UserService, FavoritesService } from '../../services';
import { FavoritesController } from './favorites.controller';

describe('The Favorites Controller', () => {
  const controller: FavoritesController = createController(FavoritesController);
  const userService: UserService = createService(UserService);
  const favoritesService: FavoritesService = createService(FavoritesService);

  beforeEach(async () => {
    await connect(Config.getOrThrow('mongodb.uri', 'string'), { useNewUrlParser: true, useCreateIndex: false, useUnifiedTopology: true });
    await User.syncIndexes();
    // await disconnect();
    const firstName = "test";
    const secondName = "test";
    const email = "test";
    const username = "test";
    const password = "qqweupodfsksjffewfd232@";
    await userService.insertUser(firstName, email, username, password, emptyPrefs(), secondName);

    const plan = new Plan();
    plan.name = 'piano';
    plan.numRecipes = 3;
    plan.estimatedCost = CostLevels.high;
    await plan.save();
  });

  afterEach(async () => {
    // await connect(Config.getOrThrow('mongodb.uri', 'string'), { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
    await connection.db.dropCollection('userclasses');
    await connection.db.dropCollection('planclasses');
    await disconnect();
  });

  describe('add', () => {
    describe('When JWT is set but linked with deleted user', () => {
      it('returns bad request response', async () => {
        const ctx = new Context({});
        ctx.user = { username: "test2" };
        ctx.request.body = {
          planId: "test",
        };

        const authResponse = {
          text: 'User does not exist anymore',
        };

        const expectedResponse = new HttpResponseBadRequest(authResponse);
        const actualResponse = await controller.addFavoritePlan(ctx);
        deepEqual(actualResponse, expectedResponse);
      });
    });

    describe('When the plan does not exists', () => {
      it('returns bad request response', async () => {
        const ctx = new Context({});
        ctx.user = { username: "test" };
        ctx.request.body = {
          planId: "test",
        };

        const authResponse = {
          text: 'This plan does not exist',
        };

        const expectedResponse = new HttpResponseBadRequest(authResponse);
        const actualResponse = await controller.addFavoritePlan(ctx);
        deepEqual(actualResponse, expectedResponse);
      });
    });

    describe('When user and plan exist', () => {
      it('returns ok request response', async () => {
        const plan = await Plan.findOne({ name: 'piano' });

        const ctx = new Context({});
        ctx.user = { username: "test" };
        ctx.request.body = {
          planId: plan?._id,
        };

        const expectedResponse = new HttpResponseOK();
        const actualResponse = await controller.addFavoritePlan(ctx);
        strictEqual(actualResponse.statusCode, expectedResponse.statusCode);
      });
    });
  });

  describe('remove', () => {
    describe('When JWT is set but linked with deleted user', () => {
      it('returns bad request response', async () => {
        const ctx = new Context({});
        ctx.user = { username: "test2" };
        ctx.request.body = {
          planId: "test",
        };

        const authResponse = {
          text: 'User does not exist anymore',
        };

        const expectedResponse = new HttpResponseBadRequest(authResponse);
        const actualResponse = await controller.removeFavoritePlan(ctx);
        deepEqual(actualResponse, expectedResponse);
      });
    });

    describe('When the plan does not exists or is not favorite', () => {
      it('returns bad request response', async () => {
        const ctx = new Context({});
        ctx.user = { username: "test" };
        ctx.request.body = {
          planId: "test",
        };

        const authResponse = {
          text: 'This plan does not exist or is not favorite',
        };

        const expectedResponse = new HttpResponseBadRequest(authResponse);
        const actualResponse = await controller.removeFavoritePlan(ctx);
        deepEqual(actualResponse, expectedResponse);
      });
    });

    describe('When user and plan exist', () => {
      beforeEach(async () => {
        await connect(Config.getOrThrow('mongodb.uri', 'string'), { useNewUrlParser: true, useCreateIndex: false, useUnifiedTopology: true });
        const plan = await Plan.findOne({ name: 'piano' });
        const user = await userService.getUserByUsername('test');
        if (user)
          await favoritesService.addFavoritePlan(user, plan?._id);
      })
      it('returns ok request response', async () => {
        const plan = await Plan.findOne({ name: 'piano' });

        const ctx = new Context({});
        ctx.user = { username: "test" };
        ctx.request.body = {
          planId: plan?._id,
        };

        const expectedResponse = new HttpResponseOK();
        const actualResponse = await controller.removeFavoritePlan(ctx);
        strictEqual(actualResponse.statusCode, expectedResponse.statusCode);
      });
    });
  });

  describe('isFavorite', () => {
    describe('When JWT is set but linked with deleted user', () => {
      it('returns bad request response', async () => {
        const ctx = new Context({});
        ctx.user = { username: "test2" };
        ctx.request.query = {
          planId: "test",
        };

        const authResponse = {
          text: 'User not found',
        };

        const expectedResponse = new HttpResponseBadRequest(authResponse);
        const actualResponse = await controller.isFavoritePlan(ctx);
        deepEqual(actualResponse, expectedResponse);
      });
    });

    describe('When the plan does not exists', () => {
      it('returns bad request response', async () => {
        const ctx = new Context({});
        ctx.user = { username: "test" };
        ctx.request.query = {
          planId: "test",
        };

        const expectedResponse = new HttpResponseBadRequest();
        const actualResponse = await controller.isFavoritePlan(ctx);
        deepEqual(actualResponse, expectedResponse);
      });
    });

    describe('When user and plan exist and plan is not favorite', () => {
      it('returns ok request response', async () => {
        const plan = await Plan.findOne({ name: 'piano' });

        const ctx = new Context({});
        ctx.user = { username: "test" };
        ctx.request.query = {
          planId: plan?._id,
        };

        const authResponse = {
          favorite: false,
        };

        const expectedResponse = new HttpResponseOK(authResponse);
        const actualResponse = await controller.isFavoritePlan(ctx);
        strictEqual(actualResponse.statusCode, expectedResponse.statusCode);
      });
    });
  });

  describe('When user and plan exist and plan is favorite', () => {
    beforeEach(async () => {
      await connect(Config.getOrThrow('mongodb.uri', 'string'), { useNewUrlParser: true, useCreateIndex: false, useUnifiedTopology: true });
      const plan = await Plan.findOne({ name: 'piano' });
      const user = await userService.getUserByUsername('test');
      if (user)
        await favoritesService.addFavoritePlan(user, plan?._id);
    })
    it('returns ok request response', async () => {
      const plan = await Plan.findOne({ name: 'piano' });

      const ctx = new Context({});
      ctx.user = { username: "test" };
      ctx.request.query = {
        planId: plan?._id,
      };

      const authResponse = {
        favorite: true,
      };

      const expectedResponse = new HttpResponseOK(authResponse);
      const actualResponse = await controller.isFavoritePlan(ctx);
      strictEqual(actualResponse.statusCode, expectedResponse.statusCode);
    });
  });

  describe('getFavoritePlans', () => {
    describe('When JWT is set but linked with deleted user', () => {
      it('returns bad request response', async () => {
        const ctx = new Context({});
        ctx.user = { username: "test2" };

        const authResponse = {
          text: 'User not found',
        };

        const expectedResponse = new HttpResponseBadRequest(authResponse);
        const actualResponse = await controller.getFavoritePlans(ctx);
        deepEqual(actualResponse, expectedResponse);
      });
    });

    describe('When user is valid and has no favorites', () => {
      it('returns bad request response', async () => {
        const ctx = new Context({});
        ctx.user = { username: "test" };

        const expectedResponse = new HttpResponseBadRequest();
        const actualResponse = await controller.getFavoritePlans(ctx);
        deepEqual(actualResponse, expectedResponse);
      });
    });

    describe('When user is valid and has favorites', () => {
      beforeEach(async () => {
        await connect(Config.getOrThrow('mongodb.uri', 'string'), { useNewUrlParser: true, useCreateIndex: false, useUnifiedTopology: true });
        const plan = await Plan.findOne({ name: 'piano' });
        const user = await userService.getUserByUsername('test');
        if (user)
          await favoritesService.addFavoritePlan(user, plan?._id);
      })
      it('returns ok response with favorites plans list', async () => {
        const plan = await Plan.findOne({ name: 'piano' });
        const ctx = new Context({});
        ctx.user = { username: "test" };

        const authResponse = {
          text: 'List of favorite plans user test',
          planList: [{ info: [Object], id: plan?._id }]
        }

        const expectedResponse = new HttpResponseOK(authResponse);
        const actualResponse = await controller.getFavoritePlans(ctx);
        strictEqual(actualResponse.statusCode, expectedResponse.statusCode);
      });
    });
  });
});
