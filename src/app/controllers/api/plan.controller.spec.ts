import { deepEqual } from 'assert';
import {
  Context,
  createController,
  Config,
  HttpResponseNotFound
} from '@foal/core';
import { connection, connect, disconnect } from 'mongoose';
import { HttpResponseOK, HttpResponseConflict } from '@foal/core';
import { CostLevels, Plan } from '../../models';
import { emptyPrefs } from '../../models/preferences.model';
import { PlanController } from './plan.controller';

async function createFakePlan() {
  const plan = new Plan();
  plan.name = 'piano';
  plan.numRecipes = 3;
  plan.estimatedCost = CostLevels.high;
  plan.preferences = emptyPrefs();
  await plan.save();
}

describe('The Plan Controller', () => {
  const controller: PlanController = createController(PlanController);

  beforeEach(async () => {
    await connect(Config.getOrThrow('mongodb.uri', 'string'), { useNewUrlParser: true, useCreateIndex: false, useUnifiedTopology: true });
    await createFakePlan();
    await Plan.syncIndexes();
  });

  afterEach(async () => {
    await connection.db.dropCollection('planclasses');
    await disconnect();
  });

  describe('get', () => {
    describe('When the plan exists', () => {
      before(async () => {
        await connect(Config.getOrThrow('mongodb.uri', 'string'), { useNewUrlParser: true, useCreateIndex: false, useUnifiedTopology: true });
        // await createFakePlan();
      });
      it('returns OK response', async () => {
        const plan = await Plan.findOne({ name: 'piano' });

        const ctx = new Context({});
        ctx.request.query = {
          planId: plan?._id
        };
        const getPlanResponse = {
          text: "Plan found, all good so far",
          name: 'piano',
          recipes: [],
          author: undefined,
        };

        const expectedResponse = new HttpResponseOK(getPlanResponse);
        const actualResponse = await controller.getRecipeById(ctx);
        deepEqual(actualResponse, expectedResponse);
      });
    });

    describe('When the plan does not exists', () => {
      it('returns OK response', async () => {
        const notExistingPlanId = 'test';

        const ctx = new Context({});
        ctx.request.query = {
          planId: notExistingPlanId
        };

        const expectedResponse = new HttpResponseNotFound({ text: "Plan not found" });
        const actualResponse = await controller.getRecipeById(ctx);
        deepEqual(actualResponse, expectedResponse);
      });
    });

  });

  describe('/generate', () => {
    describe('When params are ok without preferences', () => {
      it('returns OK response', async () => {
        const ctx = new Context({});
        ctx.request.body = {
          name: 'testplan',
          numberOfMeals: 3,
          usingPreferences: false,
          // preferences: {},
          budget: "elevato"
        };

        ctx.request.body = JSON.stringify(ctx.request.body);
        const expectedResponse = new HttpResponseOK();
        const actualResponse = await controller.generatePlan(ctx);
        deepEqual(actualResponse.statusCode, expectedResponse.statusCode);

      });
    });

    describe('When plan name already exists', () => {
      it('returns 409 conflict response', async () => {
        const ctx = new Context({});
        ctx.request.body = {
          name: 'piano',
          numberOfMeals: 3,
          usingPreferences: false,
          // preferences: {},
          budget: "elevato"
        };

        ctx.request.body = JSON.stringify(ctx.request.body);
        const expectedResponse = new HttpResponseConflict({
          text: 'Error: duplicate plan name'
        });
        const actualResponse = await controller.generatePlan(ctx);
        deepEqual(actualResponse.statusCode, expectedResponse.statusCode);

      });
    });
  });

});
