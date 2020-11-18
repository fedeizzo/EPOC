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

export const NegativePreferences = getModelForClass(NegativePreferencesClass);
export const PositivePreferences = getModelForClass(PositivePreferencesClass);
export const Preferences = getModelForClass(PreferencesClass);
