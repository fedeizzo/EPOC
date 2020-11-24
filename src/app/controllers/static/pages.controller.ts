import { Context, Get, HttpResponseNotFound, render } from "@foal/core";

export class PagesController {
  @Get("recipe/:recipeId")
  async getRecipePage(ctx: Context) {
    if (!ctx.request.accepts("html")) {
      return new HttpResponseNotFound();
    }
    return render("./public/pages/recipe.html");
  }

  @Get("plan/:planId")
  async getPlanPage(ctx: Context) {
    if (!ctx.request.accepts("html")) {
      return new HttpResponseNotFound();
    }
    return render("./public/pages/plan.html");
  }

  @Get("generate/")
  async getGeneratePlanPage(ctx: Context) {
    if (!ctx.request.accepts("html")) {
      return new HttpResponseNotFound();
    }
    return render("./public/pages/generate_plan.html");
  }

  @Get("search")
  async serachPage(ctx: Context) {
    if (!ctx.request.accepts("html")) {
      return new HttpResponseNotFound();
    }
    return render("./public/pages/search.html");
  }

  @Get('/signup')
  async signupPage(ctx: Context) {
    if (!ctx.request.accepts('html')) {
      return new HttpResponseNotFound();
    }

    return await render('./public/signup.html');
  }

  @Get('/login')
  async loginPage(ctx: Context) {
    if (!ctx.request.accepts('html')) {
      return new HttpResponseNotFound();
    }

    return await render('./public/login.html');
  }

  @Get('/deleteUser')
  async deleteUserPage(ctx: Context) {
    if (!ctx.request.accepts('html')) {
      return new HttpResponseNotFound();
    }

    return await render('./public/deleteUser.html');
  }
}
