import { prop, getModelForClass } from "@typegoose/typegoose";

class IngredientClass {
  @prop({ type: String, required: true, unique: true })
  public name: string;
}

export const Ingredient = getModelForClass(IngredientClass);
