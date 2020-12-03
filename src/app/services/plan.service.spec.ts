import * as faker from "faker";
import { DocumentType } from "@typegoose/typegoose";
import { Config, createService } from "@foal/core";
import { connect, disconnect, Types } from "mongoose";
import { PlanService } from "./plan.service";
import { Plan, PlanClass } from "../models/plan.model";
import { CostLevels, User } from "../models";
import { emptyPrefs } from "../models/preferences.model";
import { UserClass } from "../models/user.model";
import { deepEqual, equal } from "assert";

describe("The Plan Service", () => {
  const planService: PlanService = createService(PlanService);

  beforeEach(async () => {
    const connectionSettings = {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    };
    await connect(
      Config.getOrThrow("mongodb.uri", "string"),
      connectionSettings
    );
  });

  afterEach(async () => {
    await Plan.collection.drop().catch(() => {});
    await Plan.syncIndexes().catch(() => {});
    await User.collection.drop().catch(() => {});
    await User.syncIndexes().catch(() => {});
    await disconnect();
  });

  describe("Search plans by name", () => {
    let user: DocumentType<UserClass>;
    let plans: DocumentType<PlanClass>[];
    beforeEach("add user and plans to db ", async () => {
      user = new User();
      user.firstName = faker.name.firstName();
      user.secondName = faker.name.lastName();
      user.email = faker.internet.email();
      user.username = faker.internet.userName();
      user.password = faker.internet.password();
      user.preferences = emptyPrefs();
      await user.save();
      plans = [
        await generateFakePlan("piano", user.id, 0),
        await generateFakePlan("piano 5", user.id, 10),
        await generateFakePlan("5piano", user.id, 20),
        await generateFakePlan("pianino", user.id, 30),
        await generateFakePlan("abcdefg", user.id, 40),
        await generateFakePlan("pino", user.id, 50),
        await generateFakePlan("PianO", user.id, 60),
        await generateFakePlan("pian", user.id, 70),
      ];
    });
    it("should return only relevant plans", async () => {
      const searchResult = await planService.getPlansByName("piano");
      const result = searchResult.prop as PlanClass[];
      const names = result.map((p) => p.name);
      const expectedNames = ["PianO", "piano", "piano 5", "5piano"];
      equal(result.length, expectedNames.length);
      deepEqual(new Set(names), new Set(expectedNames));
      for (const i of expectedNames) {
        equal(names.includes(i), true);
      }
      equal(names.indexOf("5piano"), expectedNames.length - 1);
    });
  });
});

async function generateFakePlan(name: String, userId: String, seed: number) {
  faker.seed(seed);
  const plan = new Plan();

  plan.name = name.valueOf();
  plan.user = Types.ObjectId(userId.valueOf());
  plan.numRecipes = faker.random.number(10);
  plan.estimatedCost = CostLevels.medium;
  plan.recipes = [];
  await plan.save();
  return plan;
}

function arraysEqual(a: any[], b: any[]) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.
  // Please note that calling sort on an array will modify that array.
  // you might want to clone your array first.

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}
