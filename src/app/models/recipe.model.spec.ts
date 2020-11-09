import { Config } from "@foal/core";
import { connect, disconnect, connection } from "mongoose";
import { Cost, NutritionalInfo, Recipe, Tool } from ".";

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

  it("should be able to be inserted in the db", async () => {
    const recipe = new Recipe();
    const nInfo = new NutritionalInfo();

    nInfo.calories = 100;
    nInfo.carbohydrate = 100;
    nInfo.cholesterol = 100;
    nInfo.fat = 100;
    nInfo.fiber = 100;
    nInfo.saturedFat = 100;
    nInfo.sodium = 100;
    nInfo.sugar = 100;

    recipe.name = "Pasta";
    recipe.dateModified = new Date();
    recipe.estimatedCost = Cost.high;
    recipe.image = "https://www.google.com";
    recipe.categories = ["none"];
    recipe.description = "wow";
    recipe.prepTime = 10;
    recipe.cookTime = 15;
    recipe.totalTime = 25;
    recipe.conservationTime = 9;
    recipe.peopleFor = 2;
    recipe.ingredients = [];
    recipe.keywords = ["pasta"];
    recipe.lables = ["first dish"];
    recipe.averageRating = 3.6;
    recipe.nutritionalInfos = nInfo;
    recipe.numberOfRatings = 400;
    recipe.requiredTools = [tool._id];
    return recipe.save();
  });
});
