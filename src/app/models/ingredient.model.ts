import { model, Schema, Document } from "mongoose";

export interface IIngredient extends Document {
  name: string;
}

const IngredientSchema: Schema = new Schema({
  name: { type: String, unique: true, required: true },
});

export default model<IIngredient>("Ingredient", IngredientSchema);
