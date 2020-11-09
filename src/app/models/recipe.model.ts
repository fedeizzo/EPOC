import { prop, getModelForClass } from "@typegoose/typegoose";
import { NutritionalInfo } from "./nutritional-info.model";

export enum Cost {
  "low",
  "medium",
  "high",
}

class RecipeClass {
  @prop({ type: String, required: true, unique: true })
  public name: string;

  @prop({ type: Date, required: true })
  public dateModified: Date;

  @prop({ enum: Cost, required: true })
  public estimatedCost: Cost;

  @prop({ type: String, required: true })
  public image: string;

  @prop({ type: [String], required: true })
  public categories: string[];

  @prop({ type: String, required: true })
  public description: string;

  @prop({ type: Number, required: true })
  public prepTime: Number;

  @prop({ type: Number, required: true })
  public cookTime: Number;

  @prop({ type: Number, required: true })
  public totalTime: Number;

  @prop({ type: Number, required: true })
  public conservationTime: Number;

  @prop({ type: Number, required: true })
  public peopleFor: Number;

  @prop({ type: [String], required: true })
  public ingredients: string[];

  @prop({ type: [String], required: true })
  public keywords: string[];

  @prop({ type: [String], required: true })
  public lables: string[];

  @prop({ type: Number, required: true })
  public averageRating: Number;

  @prop({ type: Number, required: true })
  public numberOfRatings: Number;

  @prop({ type: NutritionalInfo, required: true })
  public nutritionalInfos: NutritionalInfo;

  @prop({ type: [String], required: true })
  public requiredTools: string[];
}

export const Recipe = getModelForClass(RecipeClass);
