import {
  Context,
  Get,
  HttpResponseOK,
  HttpResponseInternalServerError,
  HttpResponseNotFound,
  HttpResponse,
  dependency,
} from "@foal/core";
import {
  RecipeService,
  ServiceResponse,
  ServiceResponseCode,
} from "../../services/index";

export class RecipeApiController {
  @dependency
  recipeService: RecipeService;

  @Get("/:recipeId")
  async getRecipeById(ctx: Context) {
    const recipeId = ctx.request.params.recipeId;

    const response: ServiceResponse = await this.recipeService.getCompleteRecipe(
      recipeId
    );

    let httpResponse: HttpResponse;
    switch (response.code) {
      case ServiceResponseCode.ok:
        httpResponse = new HttpResponseOK(response.buildResponse());
        break;
      case ServiceResponseCode.elementNotFound:
        httpResponse = new HttpResponseNotFound(response.text);
        break;
      case ServiceResponseCode.internalServerError:
        httpResponse = new HttpResponseInternalServerError(
          response.buildResponse()
        );
        break;
      default:
        httpResponse = new HttpResponseInternalServerError( { text: 'Internal error' } );
        break;
    }

    return httpResponse;
  }
}
