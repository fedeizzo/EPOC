import { when, anything, spy } from "ts-mockito";
import {
  createController,
  getHttpMethod,
  getPath,
  Context,
  HttpResponseBadRequest,
  HttpResponseOK,
} from "@foal/core";
import { deepEqual, strictEqual } from "assert";
import { SearchApiController } from "./search.controller";
import { RecipeService } from "../../services";
import { RecipeResponse } from "../../services/recipe.service";
import { Recipe } from "../../models";

describe("search controller", () => {
  const globalSearchMethodName = "globalSearch";
  describe(globalSearchMethodName, () => {
    it("should handle requests at GET /.", () => {
      strictEqual(
        getHttpMethod(SearchApiController, globalSearchMethodName),
        "GET"
      );
    });
    it("should handle the route /", () => {
      strictEqual(getPath(SearchApiController, globalSearchMethodName), "/");
    });
    // describe("should include the result from recipeSearch in the response", () => {
    //   let controller: SearchApiController;
    //   let mockResponse: RecipeResponse;
    //   let mockRecipeService: RecipeService;
    //   let mockContext: Context;
    //   const mockReq: any = mock({});

    //   beforeEach(() => {
    //     mockContext = mock(Context);
    //     when(mockReq.query).thenReturn({ searchString: "_" });
    //     when(mockContext.request).thenReturn(mockReq);
    //     mockResponse = mock(RecipeResponse);
    //     mockRecipeService = mock(RecipeService);
    //     controller = createController(SearchApiController, {
    //       recipeService: instance(mockRecipeService),
    //     });
    //     when(mockRecipeService.getPartialRecipeList(anything())).thenResolve(
    //       instance(mockResponse)
    //     );
    //   });

    //   it("if it's an error", async () => {
    //     //Arrange
    //     const statusCode = 404;
    //     when(mockResponse.code).thenReturn(statusCode);
    //     const recipeResponse = {
    //       code: statusCode,
    //       text: "error",
    //       recipes: "",
    //     };
    //     when(mockResponse.buildResponse()).thenReturn(recipeResponse);
    //     const expectedResponse = new HttpResponseBadRequest(recipeResponse);
    //     //Act
    //     const res = await controller.globalSearch(instance(mockContext));
    //     //Assert
    //     deepEqual(res, expectedResponse);
    //   });
    //   it("if everything went well", async () => {
    //     //Arrange
    //     const statusCode = 200;
    //     when(mockResponse.code).thenReturn(statusCode);
    //     const recipeResponse = {
    //       code: statusCode,
    //       text: "text",
    //       recipe: { thisisa: "recipe" } as any,
    //     };
    //     when(mockResponse.buildResponse()).thenReturn(recipeResponse);
    //     //Act
    //     const expectedResponse = new HttpResponseOK(recipeResponse);
    //     const res = await controller.globalSearch(instance(mockContext));
    //     //Assert
    //     deepEqual(res, expectedResponse);
    //   });
    // });
    describe("should include the result from recipeSearch in the response", () => {
      const controller: SearchApiController = createController(
        SearchApiController
      );
      const spiedController = spy(controller);
      it("if it's an error", async () => {
        const recipeResponse = {
          code: 5123,
          text: "error",
          recipes: "",
        };
        const expectedResponse = new HttpResponseBadRequest(recipeResponse);
        when(spiedController.recipeSearch(anything())).thenResolve(
          expectedResponse
        );
        const res = await controller.globalSearch({} as Context);
        deepEqual(res, expectedResponse);
      });
      it("if everything went well", async () => {
        const recipeResponse = {
          code: 200,
          text: "everything is fine",
          recipes: "",
        };
        const expectedResponse = new HttpResponseOK(recipeResponse);
        when(spiedController.recipeSearch(anything())).thenResolve(
          expectedResponse
        );
        const res = await controller.globalSearch({} as Context);
        deepEqual(res, expectedResponse);
      });
    });
  });
});
