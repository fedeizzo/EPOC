import {
  Context,
  Get,
  HttpResponseOK,
  HttpResponseInternalServerError,
  HttpResponseNotFound,
  render,
} from "@foal/core";
import { RecipeService, ServiceResponse } from "../services/index";

export class RecipeController {
  @Get("/:recipeId")
  async getRecipePage(ctx: Context) {
    return render("./public/pages/recipe.html");
  }

  @Get("/api/:recipeId")
  async getRecipeById(ctx: Context) {
    const recipeId = ctx.request.params.recipeId;

    const recipeService = await new RecipeService();
    const response: ServiceResponse = await recipeService.getCompleteRecipe(
      recipeId
    );
    response.buildResponse();

    if (response.code === 200) {
      return new HttpResponseOK(response.buildResponse());
    } else if (response.code === 404) {
      return new HttpResponseNotFound(response.buildResponse());
    } else {
      return new HttpResponseInternalServerError(response.buildResponse());
    }
  }
}
