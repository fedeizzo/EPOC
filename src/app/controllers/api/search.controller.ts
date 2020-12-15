import {
  Context,
  Get,
  HttpResponseOK,
  HttpResponseInternalServerError,
  ValidateQueryParam,
  dependency,
  HttpResponse,
} from "@foal/core";
import { NonEmptyQuery } from "../../hooks";
import {
  PlanService,
  RecipeService,
  ServiceResponse,
  ServiceResponseCode,
} from "../../services";

export class SearchApiController {
  @dependency
  recipeService: RecipeService;

  @dependency
  planService: PlanService;

  @Get("/recipe")
  @ValidateQueryParam("searchString", { type: "string" }, { required: true })
  @NonEmptyQuery()
  async recipeSearch(ctx: Context) {
    const searched = ctx.request.query.searchString;
    let response: ServiceResponse = await this.recipeService.getPartialRecipeList(
      searched
    );

    let httpResponse: HttpResponse;
    switch (response.code) {
      case ServiceResponseCode.ok:
        httpResponse = new HttpResponseOK(response.buildResponse());
        break;
      case ServiceResponseCode.internalServerError:
        httpResponse = new HttpResponseInternalServerError(
          response.buildResponse()
        );
        break;
      default:
        httpResponse = new HttpResponseInternalServerError( { text: 'Internal error' } );
        break;
    }
    return httpResponse;
  }

  @Get("/plan")
  @ValidateQueryParam("searchString", { type: "string" }, { required: true })
  @NonEmptyQuery()
  async planSearch(ctx: Context) {
    const searched = ctx.request.query.searchString;
    let response: ServiceResponse = await this.planService.getPlansByName(
      searched
    );

    let httpResponse: HttpResponse;
    switch (response.code) {
      case ServiceResponseCode.ok:
        httpResponse = new HttpResponseOK(response.buildResponse());
        break;
      default:
        httpResponse = new HttpResponseInternalServerError(
          response.buildResponse()
        );
    }
    return httpResponse;
  }
}
