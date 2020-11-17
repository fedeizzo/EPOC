import {
  Context,
  Get,
  HttpResponseOK,
  HttpResponseBadRequest,
  HttpResponseNotFound,
  render,
} from "@foal/core";
import { RecipeService, ServiceResponse } from "../services/index";

export class SearchController {
  @Get("/")
  async serachPage(ctx: Context) {
    if (!ctx.request.accepts("html")) {
      return new HttpResponseNotFound();
    }
    const res = await render("./public/pages/search.html");
    return res;
  }

  @Get("/api")
  async globalSearch(ctx: Context) {
    return this.recipeSearch(ctx);
  }

  @Get("/recipe")
  async recipeSearch(ctx: Context) {
    const searched = ctx.request.query.searchString;
    if (searched) {
      let recipeService = await new RecipeService();
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
