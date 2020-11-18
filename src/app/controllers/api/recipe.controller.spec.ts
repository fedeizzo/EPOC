import { instance, when, anything, mock } from "ts-mockito";
import {
  createController,
  getHttpMethod,
  getPath,
  Context,
  HttpResponseOK,
  HttpResponseNotFound,
  HttpResponseInternalServerError,
} from "@foal/core";
import { deepEqual, strictEqual } from "assert";
import { RecipeApiController } from "./recipe.controller";
import { RecipeService } from "../../services";
import { ServiceResponseCode } from "../../services/response.service";
import { RecipeResponse } from "../../services/recipe.service";

describe("The Recipe Controller", () => {
  describe("getRecipeById", () => {
    it("should handle requests at GET ", () => {
      strictEqual(getHttpMethod(RecipeApiController, "getRecipeById"), "GET");
    });
    it("should handle the route /", () => {
      strictEqual(getPath(RecipeApiController, "getRecipeById"), "/:recipeId");
    });

    describe("Should include the result of the getRecipeById search in the response", () => {
      let mockRecipeService: RecipeService;
      let controller: RecipeApiController;
      beforeEach(() => {
        mockRecipeService = mock(RecipeService);
        controller = createController(RecipeApiController, {
          recipeService: instance(mockRecipeService),
        });
      });
      describe("if everything went well", () => {
        it("should return a recipe with code 200", async () => {
          const mockServiceResponse = mock(RecipeResponse);
          const mockResponseBody = {
            code: ServiceResponseCode.ok,
            text: "text",
            recipes: "ndsaioad8",
          };
          when(mockServiceResponse.buildResponse()).thenReturn(
            mockResponseBody
          );
          when(mockServiceResponse.code).thenReturn(ServiceResponseCode.ok);
          when(mockRecipeService.getCompleteRecipe(anything())).thenResolve(
            instance(mockServiceResponse)
          );

          const mockContext = mock(Context);
          const mockReq: any = mock();
          when(mockContext.request).thenReturn(instance(mockReq));
          when(mockReq.params).thenReturn({ recipeId: "anything" });

          const res = await controller.getRecipeById(instance(mockContext));
          deepEqual(res, new HttpResponseOK(mockResponseBody));
        });
      });
      describe("if the id does not exist", () => {
        it("should return an Error Not Found response with code 404", async () => {
          const mockServiceResponse = mock(RecipeResponse);
          const mockResponseBody = {
            code: 404,
            text: "Recipe not found",
            recipes: "",
          };
          when(mockServiceResponse.buildResponse()).thenReturn(
            mockResponseBody
          );
          when(mockServiceResponse.code).thenReturn(
            ServiceResponseCode.elementNotFound
          );
          when(mockRecipeService.getCompleteRecipe(anything())).thenResolve(
            instance(mockServiceResponse)
          );

          const mockContext = mock(Context);
          const mockReq: any = mock();
          when(mockContext.request).thenReturn(instance(mockReq));
          when(mockReq.params).thenReturn({ recipeId: "anything" });

          const res = await controller.getRecipeById(instance(mockContext));
          deepEqual(res, new HttpResponseNotFound(mockResponseBody));
        });
      });

      describe("if the id is syntactically wrong", () => {
        it("should return Internal Server Error, with error code 500", async () => {
          const mockServiceResponse = mock(RecipeResponse);
          const mockResponseBody = {
            code: 500,
            text: "Id is wrong",
            recipes: "",
          };
          when(mockServiceResponse.buildResponse()).thenReturn(
            mockResponseBody
          );
          when(mockServiceResponse.code).thenReturn(
            ServiceResponseCode.internalServerErrorQueryingRecipes
          );
          when(mockRecipeService.getCompleteRecipe(anything())).thenResolve(
            instance(mockServiceResponse)
          );

          const mockContext = mock(Context);
          const mockReq: any = mock();
          when(mockContext.request).thenReturn(instance(mockReq));
          when(mockReq.params).thenReturn({ recipeId: "anything" });

          const res = await controller.getRecipeById(instance(mockContext));
          deepEqual(res, new HttpResponseInternalServerError(mockResponseBody));
        });
      });
    });
  });
});
