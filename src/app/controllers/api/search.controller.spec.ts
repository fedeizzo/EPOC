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
import { ServiceResponseCode } from "../../services";

describe("The search controller", () => {
  const globalSearchMethodName = "globalSearch";
  describe("When we look for a recipe using a string", () => {
    it("should handle requests at GET /.", () => {
      strictEqual(
        getHttpMethod(SearchApiController, globalSearchMethodName),
        "GET"
      );
    });
    it("should handle the route /", () => {
      strictEqual(getPath(SearchApiController, globalSearchMethodName), "/");
    });
    describe("Should include the result from recipeSearch in the response", () => {
      const controller: SearchApiController = createController(
        SearchApiController
      );
      const spiedController = spy(controller);
      describe("if it's an error", async () => {
        it("should return an error with code 304", async () => {
          const recipeResponse = {
            code: 304,
            text: "error",
            recipes: "",
          };
          const expectedResponse = new HttpResponseBadRequest(recipeResponse);
          when(spiedController.recipeSearch(anything())).thenResolve(
            expectedResponse
          );
          const res = await controller.globalSearch({} as Context);
          deepEqual(res, expectedResponse);
        }); // TODO, check code
      });
      describe("if everything went well", async () => {
        it("should return a correct response with code 200", async () => {
          const recipeResponse = {
            code: ServiceResponseCode.ok,
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
});
