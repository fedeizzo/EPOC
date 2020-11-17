import { when, anything, spy } from "ts-mockito";
import {
  createController,
  getHttpMethod,
  getPath,
  Context,
  HttpResponseBadRequest,
  HttpResponseOK,
  HttpResponseNotFound,
} from "@foal/core";
import { deepEqual, strictEqual } from "assert";
import { RecipeApiController } from "./recipe.controller";
import { RecipeService } from "../../services";
import { RecipeResponse } from "../../services/recipe.service";
import { Recipe } from "../../models";

describe("recipe controller", () => {
  
  describe("getRecipeById", () => {
    it("should handle requests at GET ", () => {
      strictEqual(getHttpMethod(RecipeApiController, "getRecipeById"), "GET");
    });
    it("should handle the route /", () => {
      strictEqual(getPath(RecipeApiController, "getRecipeById"), "/:recipeId");
    });

    describe("should include the result if the id search in the response", () => {
      const controller: RecipeApiController = createController(
        RecipeApiController
      );
      const spiedController = spy(controller);

      describe("if everything went well", () => {
        it("should return a recipe with code 200", async () => {
          const recipeResponse = {
            code: 200,
            text: "All ok",
            recipes: "",
          };
          const expectedResponse = new HttpResponseOK(recipeResponse);
          when(spiedController.getRecipeById(anything())).thenResolve(
            expectedResponse
          );
          const res = await controller.getRecipeById({} as Context);
          deepEqual(res, expectedResponse);
        });
      });

      describe("if the id does not exist", () => {
        it("should return an Error Not Found response with code 404", async () => {
          const recipeResponse = {
            code: 404,
            text: "Recipe not found",
            recipes: "",
          };
          const expectedResponse = new HttpResponseNotFound(recipeResponse);
          when(spiedController.getRecipeById(anything())).thenResolve(
            expectedResponse
          );
          const res = await controller.getRecipeById({} as Context);
          deepEqual(res, expectedResponse);
        });
      });

      describe("if the id is syntactically wrong", () => {
        it("should return Internal Server Error, with error code 500", async () => {
          const recipeResponse = {
            code: 500,
            text: "Id is wrong",
            recipes: "",
          };
          const expectedResponse = new HttpResponseNotFound(recipeResponse);
          when(spiedController.getRecipeById(anything())).thenResolve(
            expectedResponse
          );
          const res = await controller.getRecipeById({} as Context);
          strictEqual(res.statusCode, expectedResponse.statusCode);
        });
      });
    });
  });
});
