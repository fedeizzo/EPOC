import { Context, Get, HttpResponseOK, render } from "@foal/core";

export class RecipeController {
  @Get("/*")
  generalRecipePage(_: Context) {
    return render("./public/pages/recipe.html");
  }
}
