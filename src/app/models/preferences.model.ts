import { getModelForClass, prop } from "@typegoose/typegoose";
import { CostLevels } from "./recipe.model";

abstract class CommonPreferences {
  @prop({ type: [String], unique: true })
  public recipes: String[];

  @prop({ type: [String], unique: true })
  public ingredients: String[];
}

class PositivePreferencesClass extends CommonPreferences {
  @prop({ enum: CostLevels })
  public priceRange: CostLevels;
}

class NegativePreferencesClass extends CommonPreferences {
  @prop({ type: [String], unique: true })
  public categories: String[];

  @prop({ type: [String], unique: true })
  public plans: String[];

  @prop({ type: [String], unique: true })
  public labels: String[];
}

export class PreferencesClass {
  @prop({ type: [PositivePreferencesClass] })
  public positive: PositivePreferencesClass;

  @prop({ type: [NegativePreferencesClass] })
  public negative: NegativePreferencesClass;
}

/**Returns an empty preference object*/
export function emptyPrefs() {
  const emptyPrefs = new Preferences();
  const positive = new PositivePreferences();
  positive.ingredients = [];
  positive.recipes = [];
  const negative = new NegativePreferences();
  negative.ingredients = [];
  negative.recipes = [];
  negative.categories = [];
  negative.plans = [];
  negative.labels = [];
  emptyPrefs.positive = positive;
  emptyPrefs.negative = negative;
  return emptyPrefs;
}

export const NegativePreferences = getModelForClass(NegativePreferencesClass);
export const PositivePreferences = getModelForClass(PositivePreferencesClass);
export const Preferences = getModelForClass(PreferencesClass);
