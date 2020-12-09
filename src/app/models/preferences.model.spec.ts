import { Config } from "@foal/core";
import { connect, disconnect } from "mongoose";
import { Preferences, NegativePreferences, PositivePreferences } from ".";
import { CostLevels } from "./recipe.model";

describe("The preferences model", () => {
  before(async () => {
    const uri = Config.getOrThrow("mongodb.uri", "string");
    await connect(uri, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
    await new Preferences().collection.drop().catch(() => {});
  });

  after(async () => {
    await new Preferences().collection.drop().catch(() => {});
    await disconnect();
  });

  it("when valid should be able to be inserted in the db", async () => {
    const positive = new PositivePreferences();
    positive.recipes = [];
    positive.ingredients = [];
    positive.labels = [];
    positive.priceRange = CostLevels.none;

    const negative = new NegativePreferences();
    negative.recipes = [];
    negative.ingredients = [];
    negative.labels = [];

    const prefs = new Preferences();
    prefs.positive = positive;
    prefs.negative = negative;

    await prefs.save();
  });
});
