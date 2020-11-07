import { model, Schema, Document } from "mongoose";

export interface INutritionalInfo extends Document {
  calories: number;
  carbohydrate: number;
  cholesterol: number;
  fat: number;
  fiber: number;
  saturedFat: number;
  sodium: number;
  sugar: number;
}

export const NutritionalInfoSchema: Schema = new Schema({
  calories: Number,
  carbohydrate: Number,
  cholesterol: Number,
  fat: Number,
  fiber: Number,
  saturedFat: Number,
  sodium: Number,
  sugar: Number,
});

export default model<INutritionalInfo>(
  "NutritionalInfo",
  NutritionalInfoSchema
);
