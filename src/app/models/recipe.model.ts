import { model, Schema, Document } from "mongoose";
import {
  INutritionalInfo,
  NutritionalInfoSchema,
} from "./Nutritional-info.model";

export enum Cost {
  low = "low",
  medium = "medium",
  high = "high",
}

export interface IRecipe extends Document {
  name: String;
  dateModified: Date;
  estimatedCost: Cost;
  image: String;
  categories: String[];
  description: String;
  prepTime: Number;
  cookTime: Number;
  totalTime: Number;
  conservationTime: Number;
  peopleFor: Number;
  ingredients: Schema.Types.ObjectId[];
  keywords: String[];
  lables: String[];
  averageRating: Number;
  numberOfRatings: Number;
  nutritionalInfos: INutritionalInfo;
  requiredTools: Schema.Types.ObjectId[];
}

const RecipeSchema: Schema = new Schema({
  name: String,
  dateModified: Date,
  estimatedCost: { type: String, enum: Object.values(Cost) },
  image: { type: String, max: 2048 },
  categories: [String],
  description: String,
  prepTime: Number,
  cookTime: Number,
  totalTime: Number,
  conservationTime: Number,
  peopleFor: Number,
  ingredients: [Schema.Types.ObjectId],
  keywords: [String],
  lables: [String],
  averageRating: Number,
  numberOfRatings: Number,
  nutritionalInfos: NutritionalInfoSchema,
  requiredTools: [Schema.Types.ObjectId],
});

export default model<IRecipe>("Recipe", RecipeSchema);
