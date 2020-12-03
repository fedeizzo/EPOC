import { getModelForClass, prop } from "@typegoose/typegoose";
import { CostLevels } from "./recipe.model";

abstract class CommonPreferences {
  @prop({type : new Set<String>()})
  public recipes: Set<String>;
  @prop({type : new Set<String>()})
  public ingredients: Set<String>;
  @prop({type : new Set<String>()})
  public labels: Set<String>;
}

export class PositivePreferences extends CommonPreferences {
  @prop({type : CostLevels})
  public priceRange: CostLevels;
}

export class NegativePreferences extends CommonPreferences {}

export class PreferencesClass {
  @prop({type : PositivePreferences})
  public positive: PositivePreferences;
  @prop({type : NegativePreferences})
  public negative: NegativePreferences;
}

/**Returns an empty preference object*/
export function emptyPrefs() {
  const emptyPrefs = new Preferences();

  const positive = new PositivePreferences();
  positive.ingredients = new Set<string>();
  positive.recipes = new Set<string>();
  positive.labels = new Set<string>();
  positive.priceRange = CostLevels.none;

  const negative = new NegativePreferences();
  negative.ingredients = new Set<string>();
  negative.recipes = new Set<string>();
  negative.labels = new Set<string>();

  emptyPrefs.positive = positive;
  emptyPrefs.negative = negative;
  emptyPrefs.save();
  return emptyPrefs;
}

export const Preferences = getModelForClass(PreferencesClass);
