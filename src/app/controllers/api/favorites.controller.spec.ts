import { deepEqual, strictEqual } from 'assert';
import { Context, createController, Config, HttpResponse, HttpResponseNotFound, HttpResponseUnauthorized, createService } from '@foal/core';
import { connection, connect, disconnect } from 'mongoose';
import { HttpResponseOK, HttpResponseForbidden, HttpResponseConflict, HttpResponseBadRequest } from '@foal/core';
import { Plan, User, CostLevels } from '../../models';
import { UserService } from '../../services';
import { FavoritesController } from './favorites.controller';

describe('The Favorites Controller', () => {
  const controller: FavoritesController = createController(FavoritesController);
  const userService: UserService = createService(UserService);

  beforeEach(async () => {
    await connect(Config.getOrThrow('mongodb.uri', 'string'), { useNewUrlParser: true, useCreateIndex: false, useUnifiedTopology: true });
    await User.syncIndexes();
    // await disconnect();
    const firstName = "test";
    const secondName = "test";
    const email = "test";
    const username = "test";
    const password = "qqweupodfsksjffewfd232@";
    await userService.insertUser(firstName, email, username, password, secondName);

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
});
