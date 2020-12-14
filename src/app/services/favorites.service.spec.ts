import { Config, createService } from '@foal/core';
import { strictEqual } from 'assert';
import { UserService, FavoritesService } from './';
import { connection, connect, disconnect } from 'mongoose';
import { ServiceResponseCode } from './response.service';
import { CostLevels, User } from '../models';
import { emptyPrefs } from '../models/preferences.model';
import { Plan } from '../models/plan.model';

async function createFakeUser(userService: UserService) {
  const firstName = "test";
  const secondName = "test";
  const email = "test";
  const username = "test";
  const password = "qqweupodfsksjffewfd232@";
  await userService.insertUser(firstName, email, username, password, emptyPrefs(), secondName);
  return username;
}

async function createFakePlan() {
  const plan = new Plan();
  plan.name = 'piano';
  plan.numRecipes = 3;
  plan.estimatedCost = CostLevels.high;
  await plan.save();
  return plan._id;
}

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
        await createFakeUser(userService);
        await createFakePlan();
      });
      it('returns a ok response', async () => {
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
        await createFakeUser(userService);
        await createFakePlan();
      });
      it('returns a bad response with error element not found', async () => {
        const expectedErrorCode: ServiceResponseCode = ServiceResponseCode.elementNotFound;
        const username = 'test';
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

  describe('removeFavoritePlan', () => {
    describe('When user and plan exists and plan is favorite', () => {
      before(async () => {
        await connect(Config.getOrThrow('mongodb.uri', 'string'), { useNewUrlParser: true, useCreateIndex: false, useUnifiedTopology: true });
        const username = await createFakeUser(userService);
        const id = await createFakePlan();
        const user = await userService.getUserByUsername(username);
        if (user != undefined)
          await favoriteService.addFavoritePlan(user, id);
      });
      it('returns a ok response', async () => {
        const expectedErrorCode: ServiceResponseCode = ServiceResponseCode.ok;
        const username = "test";
        const user = await userService.getUserByUsername(username);
        const plan = await Plan.findOne({ name: 'piano' });

        if (user != undefined) {
          const actualErrorCode = await favoriteService.removeFavoritePlan(user, plan?._id);
          strictEqual(actualErrorCode.code, expectedErrorCode);
        } else {
          throw 'Error';
        }
      });
    });
    describe('When user and plan exists and plan is not favorite', () => {
      before(async () => {
        await connect(Config.getOrThrow('mongodb.uri', 'string'), { useNewUrlParser: true, useCreateIndex: false, useUnifiedTopology: true });
        await createFakeUser(userService);
        await createFakePlan();
      });
      it('returns a bad response with error element not found', async () => {
        const expectedErrorCode: ServiceResponseCode = ServiceResponseCode.elementNotFound;
        const username = "test";
        const user = await userService.getUserByUsername(username);
        const plan = await Plan.findOne({ name: 'piano' });

        if (user != undefined) {
          const actualErrorCode = await favoriteService.removeFavoritePlan(user, plan?._id);
          strictEqual(actualErrorCode.code, expectedErrorCode);
        } else {
          throw 'Error';
        }
      });
    });
    describe('When plan does not exists', () => {
      before(async () => {
        await connect(Config.getOrThrow('mongodb.uri', 'string'), { useNewUrlParser: true, useCreateIndex: false, useUnifiedTopology: true });
        await createFakeUser(userService);
        await createFakePlan();
      });
      it('returns a bad response with error element not found', async () => {
        const expectedErrorCode: ServiceResponseCode = ServiceResponseCode.elementNotFound;
        const username = 'test';
        const idNotExistingPlan = 'test';
        const user = await userService.getUserByUsername(username);
        if (user != undefined) {
          const actualErrorCode = await favoriteService.removeFavoritePlan(user, idNotExistingPlan);
          strictEqual(actualErrorCode.code, expectedErrorCode);
        } else {
          throw 'Error';
        }
      });
    });
  });

  describe('isPlanAlreadyFavorite', () => {
    describe('When user and plan exists and plan is favorite', () => {
      before(async () => {
        await connect(Config.getOrThrow('mongodb.uri', 'string'), { useNewUrlParser: true, useCreateIndex: false, useUnifiedTopology: true });
        const username = await createFakeUser(userService);
        const id = await createFakePlan();
        const user = await userService.getUserByUsername(username);
        if (user != undefined)
          await favoriteService.addFavoritePlan(user, id);
      });
      it('returns true', async () => {
        const expected = true;
        const username = "test";
        const user = await userService.getUserByUsername(username);
        const plan = await Plan.findOne({ name: 'piano' });

        if (user != undefined) {
          const actual = favoriteService.isPlanAlreadyFavorite(user, plan?._id);
          strictEqual(actual, expected);
        } else {
          throw 'Error';
        }
      });
    });
    describe('When user and plan exists and plan is not favorite', () => {
      before(async () => {
        await connect(Config.getOrThrow('mongodb.uri', 'string'), { useNewUrlParser: true, useCreateIndex: false, useUnifiedTopology: true });
        const username = await createFakeUser(userService);
        const id = await createFakePlan();
        const user = await userService.getUserByUsername(username);
      });
      it('returns false', async () => {
        const expected = false;
        const username = "test";
        const user = await userService.getUserByUsername(username);
        const plan = await Plan.findOne({ name: 'piano' });

        if (user != undefined) {
          const actual = favoriteService.isPlanAlreadyFavorite(user, plan?._id);
          strictEqual(actual, expected);
        } else {
          throw 'Error';
        }
      });
    });
  });

  describe('isFavoritePlan', () => {
    describe('When user and plan exists and plan is not favorite', () => {
      before(async () => {
        await connect(Config.getOrThrow('mongodb.uri', 'string'), { useNewUrlParser: true, useCreateIndex: false, useUnifiedTopology: true });
        await createFakeUser(userService);
        await createFakePlan();
      });
      it('returns a ok response', async () => {
        const expectedErrorCode: ServiceResponseCode = ServiceResponseCode.ok;
        const username = "test";
        const user = await userService.getUserByUsername(username);
        const plan = await Plan.findOne({ name: 'piano' });

        if (user != undefined) {
          const actualErrorCode = await favoriteService.isFavoritePlan(user, plan?._id);
          strictEqual(actualErrorCode.code, expectedErrorCode);
        } else {
          throw 'Error';
        }
      });
    });
    describe('When user and plan exists and plan is favorite', () => {
      before(async () => {
        await connect(Config.getOrThrow('mongodb.uri', 'string'), { useNewUrlParser: true, useCreateIndex: false, useUnifiedTopology: true });
        const username = await createFakeUser(userService);
        const id = await createFakePlan();
        const user = await userService.getUserByUsername(username);
        if (user != undefined)
          await favoriteService.addFavoritePlan(user, id);
      });
      it('returns a elementAlreadyInCollection response', async () => {
        const expectedErrorCode: ServiceResponseCode = ServiceResponseCode.elementAlreadyInCollection;
        const username = "test";
        const user = await userService.getUserByUsername(username);
        const plan = await Plan.findOne({ name: 'piano' });

        if (user != undefined) {
          const actualErrorCode = await favoriteService.isFavoritePlan(user, plan?._id);
          strictEqual(actualErrorCode.code, expectedErrorCode);
        } else {
          throw 'Error';
        }
      });
    });
    describe('When plan does not exists', () => {
      before(async () => {
        await connect(Config.getOrThrow('mongodb.uri', 'string'), { useNewUrlParser: true, useCreateIndex: false, useUnifiedTopology: true });
        await createFakeUser(userService);
        await createFakePlan();
      });
      it('returns a bad response with error element not found', async () => {
        const expectedErrorCode: ServiceResponseCode = ServiceResponseCode.elementNotFound;
        const username = 'test';
        const idNotExistingPlan = 'test';
        const user = await userService.getUserByUsername(username);
        if (user != undefined) {
          const actualErrorCode = await favoriteService.isFavoritePlan(user, idNotExistingPlan);
          strictEqual(actualErrorCode.code, expectedErrorCode);
        } else {
          throw 'Error';
        }
      });
    });
  });
  describe('getFavoritePlansByUser', () => {
    describe('When user has not favorites', () => {
      before(async () => {
        await connect(Config.getOrThrow('mongodb.uri', 'string'), { useNewUrlParser: true, useCreateIndex: false, useUnifiedTopology: true });
        await createFakeUser(userService);
        await createFakePlan();
      });
      it('returns an ok response with empty list', async () => {
        const expectedErrorCode: ServiceResponseCode = ServiceResponseCode.ok;
        const username = "test";
        const user = await userService.getUserByUsername(username);

        if (user != undefined) {
          const serviceResponse = await favoriteService.getFavoritePlansByUser(user);
          strictEqual(serviceResponse.code, expectedErrorCode);
          strictEqual(serviceResponse.prop.length, 0);
        } else {
          throw 'Error';
        }
      });
    });
    describe('When user has favorites', () => {
      before(async () => {
        await connect(Config.getOrThrow('mongodb.uri', 'string'), { useNewUrlParser: true, useCreateIndex: false, useUnifiedTopology: true });
        const username = await createFakeUser(userService);
        const id = await createFakePlan();
        const user = await userService.getUserByUsername(username);
        if (user != undefined)
          await favoriteService.addFavoritePlan(user, id);
      });
      it('returns a ok response', async () => {
        const plan = await Plan.findOne({ name: 'piano' });
        const username = "test";
        const user = await userService.getUserByUsername(username);

        if (user != undefined) {
          const actualResponse = await favoriteService.getFavoritePlansByUser(user);
          strictEqual(actualResponse.buildResponse().planList[0].name, plan?.name);
        } else {
          throw 'Error';
        }
      });
    });
  });
});

