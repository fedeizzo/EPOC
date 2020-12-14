import { equal } from "assert";
import { NegativePreferences, PositivePreferences } from ".";
import { PreferencesClass } from "./preferences.model";
import { CostLevels } from "./recipe.model";

describe("The preferences class", () => {
  it("should have a working constructor", async () => {
    const positive = new PositivePreferences();
    positive.recipes = [];
    positive.ingredients = [];
    positive.labels = [];
    positive.priceRange = CostLevels.none;

    const negative = new NegativePreferences();
    negative.recipes = [];
    negative.ingredients = [];
    negative.labels = [];

    const prefs = new PreferencesClass(positive, negative);

    equal(prefs.positive, positive);
    equal(prefs.negative, negative);
  });
});
