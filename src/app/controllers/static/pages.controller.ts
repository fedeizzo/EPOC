import { Context, Get, HttpResponseNotFound, render } from "@foal/core";

export class PagesController {
  @Get("recipe/:recipeId")
  async getRecipePage(ctx: Context) {
    if (!ctx.request.accepts("html")) {
      return new HttpResponseNotFound();
    }
    return render("./public/pages/recipe.html");
  }

  @Get("search")
  async serachPage(ctx: Context) {
    if (!ctx.request.accepts("html")) {
      return new HttpResponseNotFound();
    }
    return render("./public/pages/search.html");
  }
}
