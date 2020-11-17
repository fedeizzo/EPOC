import {
  Context,
  Get,
  HttpResponseOK,
  HttpResponseBadRequest,
  ValidateQueryParam,
  dependency,
} from "@foal/core";
import { RecipeService, ServiceResponse } from "../../services";

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
    if (response.code === 200) {
      return new HttpResponseOK(response.buildResponse());
    } else {
      return new HttpResponseBadRequest(response.buildResponse());
    }
  }
}
