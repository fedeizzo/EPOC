import { getModelForClass, prop } from "@typegoose/typegoose";
import { CostLevels } from "./recipe.model";

abstract class CommonPreferences {
  @prop({ _id: false })
  @prop({type : [String]})
  public recipes: String[];
  @prop({type : [String]})
  public ingredients: String[];
  @prop({type : [String]})
  public labels: String[];
}

export class PositivePreferences extends CommonPreferences {
  @prop({type : Object})
  public priceRange: CostLevels;
}

export class NegativePreferences extends CommonPreferences {}

export class PreferencesClass {
  @prop({ _id: false })
  @prop({type : PositivePreferences})
  public positive: PositivePreferences;
  @prop({type : NegativePreferences})
  public negative: NegativePreferences;
}

/**Returns an empty preference object*/
export function emptyPrefs() {
  const emptyPrefs = new Preferences();

  const positive = new PositivePreferences();
  positive.ingredients = [];
  positive.recipes = [];
  positive.labels = [];
  positive.priceRange = CostLevels.none;

  const negative = new NegativePreferences();
  negative.ingredients = [];
  negative.recipes = [];
  negative.labels = [];

  emptyPrefs.positive = positive;
  emptyPrefs.negative = negative;
  emptyPrefs.save();
  return emptyPrefs;
}

export const Preferences = getModelForClass(PreferencesClass);
