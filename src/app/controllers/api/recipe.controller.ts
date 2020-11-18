import {
  Context,
  Get,
  HttpResponseOK,
  HttpResponseInternalServerError,
  HttpResponseNotFound,
  HttpResponse
} from "@foal/core";
import { RecipeService, ServiceResponse, ServiceResponseCode } from "../../services/index";

export class RecipeApiController {
  @Get("/:recipeId")
  async getRecipeById(ctx: Context) {
    const recipeId = ctx.request.params.recipeId;

    const recipeService = await new RecipeService();
    const response: ServiceResponse = await recipeService.getCompleteRecipe(
      recipeId
    );

    let httpResponse: HttpResponse;
    switch (response.code) {
      case ServiceResponseCode.ok:
        httpResponse = new HttpResponseOK(response.buildResponse());
        break;
      case ServiceResponseCode.recipeIdNotFound:
        httpResponse = new HttpResponseNotFound(response.buildResponse());
        break;
      case ServiceResponseCode.internalServerErrorQueryingRecipes:
        httpResponse = new HttpResponseInternalServerError(response.buildResponse());
        break;
      default:
        httpResponse = new HttpResponseInternalServerError();
        break;
    }

    return httpResponse;
  }
}
