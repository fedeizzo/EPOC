import {
  Context,
  Get,
  HttpResponseOK,
  HttpResponseBadRequest,
  ValidateQueryParam,
} from "@foal/core";
import { RecipeService, ServiceResponse } from "../../services";

export class SearchApiController {
  @Get("/")
  @ValidateQueryParam("searchString", { type: "string" }, { required: true })
  async globalSearch(ctx: Context) {
    return this.recipeSearch(ctx);
  }

  @Get("/recipe")
  async recipeSearch(ctx: Context) {
    const searched = ctx.request.query.searchString;
    if (searched) {
      let recipeService = new RecipeService();
      let response: ServiceResponse = await recipeService.getPartialRecipeList(
        searched
      );
      if (response.code === 200) {
        return new HttpResponseOK(response.buildResponse());
      } else {
        return new HttpResponseBadRequest(response.buildResponse());
      }
    }
    return new HttpResponseBadRequest("You did'nt specify the query string");
  }
}
