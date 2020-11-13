import {
  Context,
  Get,
  HttpResponseNotFound,
  HttpResponseOK,
  render,
  ValidateQueryParam,
} from "@foal/core";
import {
  CostLevels,
  IngredientInRecipe,
  NutritionalInfo,
  Recipe,
  Tool,
  UnitsOfMeasure,
} from "../models";

export class SearchController {
  @Get("/")
  async search(ctx: Context) {
    if (!ctx.request.accepts("html")) {
      return new HttpResponseNotFound();
    }
    const res = await render("./public/pages/search.html");
    return res;
  }

  @Get("/recipe")
  @ValidateQueryParam("searchString", { type: "string" }, { required: true })
  searchRecipe(ctx: Context) {
    const searchString = ctx.request.query.searchString;
    const result = [this.getFakeRecipe()];
    const res = new HttpResponseOK(JSON.stringify(result));
    return res;
  }
  getFakeRecipe() {
    const tool = new Tool();
    tool.name = "forno";

    const nInfo = new NutritionalInfo();
    nInfo.calories = 100;
    nInfo.carbohydrate = 100;
    nInfo.cholesterol = 100;
    nInfo.fat = 100;
    nInfo.fiber = 100;
    nInfo.saturedFat = 100;
    nInfo.sodium = 100;
    nInfo.sugar = 100;

    const ingredient1 = new IngredientInRecipe();
    ingredient1.name = "tunafish";
    ingredient1.quantity = 100;
    ingredient1.unitOfMeasure = UnitsOfMeasure.grams;

    const ingredient2 = new IngredientInRecipe();
    ingredient2.name = "pasta";
    ingredient2.quantity = 220;
    ingredient2.unitOfMeasure = UnitsOfMeasure.grams;

    const recipe = new Recipe();
    recipe.name = "Tuna Pasta";
    recipe.dateModified = new Date(2020, 11, 10);
    recipe.estimatedCost = CostLevels.low;
    recipe.image =
      "https://images.unsplash.com/photo-1605256107786-c598074d5027";
    recipe.categories = ["cheap", "fish dishes"];
    recipe.description = "Classic, easy and cheap recipe";
    recipe.prepTime = 10;
    recipe.cookTime = 15;
    recipe.totalTime = 25;
    recipe.conservationTime = 9;
    recipe.peopleFor = 2;
    recipe.ingredients = [ingredient1, ingredient2];
    recipe.keywords = ["test", "test2"];
    recipe.lables = ["first dish"];
    recipe.averageRating = 3.6;
    recipe.nutritionalInfos = nInfo;
    recipe.numberOfRatings = 400;
    recipe.requiredTools = [tool._id];
    return recipe;
  }
}
