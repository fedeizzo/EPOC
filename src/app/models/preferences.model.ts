import { prop } from "@typegoose/typegoose";
import { CostLevels } from "./recipe.model";

abstract class CommonPreferences {
  @prop({ type: String })
  public recipes: String[];
  @prop({ type: String })
  public ingredients: String[];
  @prop({ type: String })
  public labels: String[];
}

export class PositivePreferences extends CommonPreferences {
  @prop({ enum: CostLevels })
  public priceRange: CostLevels;
}

export class NegativePreferences extends CommonPreferences {}

export class PreferencesClass {
  constructor(positive: PositivePreferences, negative: NegativePreferences) {
    this.positive = positive;
    this.negative = negative;
  }

  @prop({ type: PositivePreferences })
  public positive: PositivePreferences;
  @prop({ type: NegativePreferences })
  public negative: NegativePreferences;
}

/**Returns an empty preference object*/
export function emptyPrefs() {
  const positive = new PositivePreferences();
  positive.ingredients = [];
  positive.recipes = [];
  positive.labels = [];
  positive.priceRange = CostLevels.none;

  const negative = new NegativePreferences();
  negative.ingredients = [];
  negative.recipes = [];
  negative.labels = [];

  const emptyPrefs = new PreferencesClass(positive, negative);
  return emptyPrefs;
}
