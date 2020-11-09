//Fixes mongoose models being delcared twice when in watch mode
import { connection } from "mongoose";
Object.keys(connection.models).forEach((key) => {
  delete connection.models[key];
});

export { User } from "./user.model";
import Recipe, { Cost, IRecipe } from "./recipe.model";
export { Recipe, Cost, IRecipe };
import Ingredient, { IIngredient } from "./ingredient.model";
export { Ingredient, IIngredient };
import Tool from "./tool.model";
export { Tool };
import NutritionalInfo, {
  NutritionalInfoSchema,
  INutritionalInfo,
} from "./nutritional-info.model";
export { NutritionalInfo, NutritionalInfoSchema, INutritionalInfo };
