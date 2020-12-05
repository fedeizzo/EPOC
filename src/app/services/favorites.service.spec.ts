import { Config, createService } from '@foal/core';
import { notEqual, strictEqual } from 'assert';
import { UserService, FavoritesService, PlanService } from './';
import { connection, connect, disconnect, Collection } from 'mongoose';
import { ServiceResponse, ServiceResponseCode } from './response.service';
import { CostLevels, User } from '../models';
import { Plan } from '../models/plan.model';

describe("The Favorites Service", () => {
  const favoriteService: FavoritesService = createService(FavoritesService);
  const userService: UserService = createService(UserService);

  beforeEach(async () => {
    await connect(Config.getOrThrow('mongodb.uri', 'string'), { useNewUrlParser: true, useCreateIndex: false, useUnifiedTopology: true });
    await User.syncIndexes();
    // await disconnect();
  });

  afterEach(async () => {
    // await connect(Config.getOrThrow('mongodb.uri', 'string'), { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
    
    await connection.db.dropCollection('userclasses');
    await connection.db.dropCollection('planclasses');
    await disconnect();
  });

  describe('addFavoritePlan', () => {
    describe('When user and plan exists', () => {
      before(async () => {
        await connect(Config.getOrThrow('mongodb.uri', 'string'), { useNewUrlParser: true, useCreateIndex: false, useUnifiedTopology: true });
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
      it('returns a ok response with error code 200', async () => {
        const expectedErrorCode: ServiceResponseCode = ServiceResponseCode.ok;
        const username = "test";
        const user = await userService.getUserByUsername(username);
        const plan = await Plan.findOne({ name: 'piano' });

        if (user != undefined) {
          const actualErrorCode = await favoriteService.addFavoritePlan(user, plan?._id);
          strictEqual(actualErrorCode.code, expectedErrorCode);
        } else {
          throw 'Error';
        }
      });
    });
    describe('When plan does not exists', () => {
      before(async () => {
        await connect(Config.getOrThrow('mongodb.uri', 'string'), { useNewUrlParser: true, useCreateIndex: false, useUnifiedTopology: true });
        const firstName = "test";
        const secondName = "test";
        const email = "test2";
        const username = "test2";
        const password = "qqweupodfsksjffewfd232@";
        await userService.insertUser(firstName, email, username, password, secondName);

        // the plan is necessary only to make the test run
        const plan = new Plan();
        plan.name = 'piano';
        plan.numRecipes = 3;
        plan.estimatedCost = CostLevels.high;
        await plan.save();
      });
      it('returns a bad response with error code 404', async () => {
        const expectedErrorCode: ServiceResponseCode = ServiceResponseCode.elementNotFound;
        const username = 'test2';
        const idNotExistingPlan = 'test';
        const user = await userService.getUserByUsername(username);
        if (user != undefined) {
          const actualErrorCode = await favoriteService.addFavoritePlan(user, idNotExistingPlan);
          strictEqual(actualErrorCode.code, expectedErrorCode);
        } else {
          throw 'Error';
        }
      });
    });
  });
});

