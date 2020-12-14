import { Config, createService } from "@foal/core";
import { strictEqual } from "assert";
import { RecipeService, ServiceResponseCode } from ".";
import { connection, connect, disconnect } from "mongoose";
import { DocumentType } from "@typegoose/typegoose";
import {
  CostLevels,
  IngredientInRecipe,
  NutritionalInfo,
  Recipe,
  Tool,
  UnitsOfMeasure,
} from "../models";

import { RecipeClass } from "../models/recipe.model";

describe("The Recipe Service", () => {
  const recipeService: RecipeService = createService(RecipeService);
  const connectionSettings = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  };
  let mockRecipeId: string = "";

  beforeEach("We insert a mock recipe in the db", async () => {
    await connect(
      Config.getOrThrow("mongodb.uri", "string"),
      connectionSettings
    );
    mockRecipeId = await createMockRecipe();
    await Recipe.syncIndexes();
    // await disconnect();
  });

  afterEach("We remove all reipes in the db", async () => {
    await connection.db.dropCollection("recipeclasses");
    await disconnect();
  });

  describe("Get Complete Recipe", () => {
    describe("When we use an existing id", () => {
      it("Returns the recipe json with code 200", async () => {
        const expectedCode = ServiceResponseCode.ok;
        const actualCode = await recipeService.getCompleteRecipe(mockRecipeId);
        strictEqual(actualCode.code, expectedCode);
      });
    });
    describe("When we use a non-existing id", () => {
      it("returns a Not Found response with error code 404", async () => {
        const expectedErrorCode = ServiceResponseCode.elementNotFound;
        const nonExistingId = "5fb37d79cbbec48c3b111111";
        const actualErrorCode = await recipeService.getCompleteRecipe(
          nonExistingId
        );
        strictEqual(actualErrorCode.code, expectedErrorCode);
      });
    });
    describe("When we use a wrong id", () => {
      it("returns a not found with error code 404", async () => {
        const expectedErrorCode = ServiceResponseCode.elementNotFound;
        const wrongId = "this is not a correct id!!!";
        const actualErrorCode = await recipeService.getCompleteRecipe(wrongId);
        strictEqual(actualErrorCode.code, expectedErrorCode);
      });
    });
  });

  describe("Get Partial Recipe List", () => {
    describe("When we use a normal searchstring", () => {
      it("Returns a json with matching recipes and 200 code", async () => {
        const expectedCode = ServiceResponseCode.ok;
        const searchString = "pasta";
        const actualCode = await recipeService.getPartialRecipeList(
          searchString
        );
        strictEqual(actualCode.code, expectedCode);
      });
    });
    describe("When we give a null search-string", () => {
      it("Returns a json with matching recipes and 200 code", async () => {
        const expectedCode = ServiceResponseCode.ok;
        const searchString = "pasta";
        const actualCode = await recipeService.getPartialRecipeList(
          searchString
        );
        strictEqual(actualCode.code, expectedCode);
      });
    });
  });
});

async function createMockRecipe() {
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
  recipe.keywords = [
    "test",
    "test2",
    "pasta",
    "pasta al tonno",
    "tonno alla pasta al tonno",
  ];
  recipe.labels = ["first dish"];
  recipe.averageRating = 3.6;
  recipe.nutritionalInfos = nInfo;
  recipe.numberOfRatings = 400;
  recipe.requiredTools = [];

  let internalRecipeId: string = "";
  try {
    const savedRecipe: DocumentType<RecipeClass> = await recipe.save();
    internalRecipeId = savedRecipe._id;
    // console.log("Id della ricetta salvata nel db temporaneo:");
    // console.log(internalRecipeId);
  } catch (error) {
    // console.log("Errore inserimento ricetta:");
    // console.error(error.message);
  }
  return internalRecipeId;
}
