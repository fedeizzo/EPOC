import { Config } from "@foal/core";
import { connect, disconnect } from "mongoose";
import {
  CostLevels,
  IngredientInRecipe,
  NutritionalInfo,
  Recipe,
  Tool,
  UnitsOfMeasure,
} from ".";

describe("The recipe model", () => {
  const tool = new Tool();
  tool.name = "forno";

  before(async () => {
    const uri = Config.getOrThrow("mongodb.uri", "string");
    await connect(uri, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
    await tool.collection.findOneAndDelete({ name: tool.name }).catch(() => {});
    await tool.save();
  });

  after(async () => {
    await tool.remove();
    await new Recipe().collection.drop();
    await disconnect();
  });

  it("when valid should be able to be inserted in the db", async () => {
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
    recipe.image = "https://www.google.com";
    recipe.categories = ["cheap", "fish dishes"];
    recipe.description = "Classic, easy and cheap recipe";
    recipe.prepTime = 10;
    recipe.cookTime = 15;
    recipe.totalTime = 25;
    recipe.conservationTime = 9;
    recipe.peopleFor = 2;
    recipe.ingredients = [ingredient1, ingredient2];
    recipe.keywords = ["test", "test2"];
    recipe.labels = ["first dish"];
    recipe.averageRating = 3.6;
    recipe.nutritionalInfos = nInfo;
    recipe.numberOfRatings = 400;
    recipe.requiredTools = [tool._id];
    return recipe.save();
  });
});
