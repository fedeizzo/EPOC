import {
  Context,
  Get,
  HttpResponseOK,
  HttpResponseInternalServerError,
  ValidateQueryParam,
  dependency,
  HttpResponse,
} from "@foal/core";
import { RecipeService, ServiceResponse, ServiceResponseCode } from "../../services";

export class SearchApiController {
  @dependency
  recipeService: RecipeService;

  @Get("/")
  @ValidateQueryParam("searchString", { type: "string" }, { required: true })
  async globalSearch(ctx: Context) {
    return this.recipeSearch(ctx);
  }

  @Get("/recipe")
  @ValidateQueryParam("searchString", { type: "string" }, { required: true })
  async recipeSearch(ctx: Context) {
    const searched = ctx.request.query.searchString;
    let response: ServiceResponse = await this.recipeService.getPartialRecipeList(
      searched
    );

    let httpResponse: HttpResponse;
    switch (response.code) {
      case ServiceResponseCode.ok:
        httpResponse = new HttpResponseOK(response.buildResponse());
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
