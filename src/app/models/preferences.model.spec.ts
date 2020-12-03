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
    positive.recipes = new Set<string>();
    positive.ingredients = new Set<string>();
    positive.labels = new Set<string>();
    positive.priceRange = CostLevels.none;

    const negative = new NegativePreferences();
    negative.recipes = new Set<string>();
    negative.ingredients = new Set<string>();
    negative.labels = new Set<string>();

    const prefs = new Preferences();
    prefs.positive = positive;
    prefs.negative = negative;

    await prefs.save();
  });
});
