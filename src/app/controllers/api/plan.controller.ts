import {
  Context,
  Get,
  Post,
  HttpResponseOK,
  dependency,
  HttpResponseNotFound,
  ValidateQueryParam,
  ValidateBody,
  HttpResponseBadRequest,
  HttpResponseInternalServerError,
  HttpResponseConflict
} from "@foal/core";
import { JWTOptional } from "@foal/jwt";
import {
  PlanService, ServiceResponse,
  ServiceResponseCode
} from "../../services";
import { User, CostLevels, PreferencesClass } from "../../models";
import { emptyPrefs } from "../../models/preferences.model";
import { NonEmptyBody, NonEmptyQuery } from "../../hooks";


const generatePlanSchema = {
  properites: {
    name: { type: "string" },
    numberOfMeals: { type: "number" },
    usingPreferences: { type: "boolean" },
    preferences: { type: "object" },
    budget: { type: typeof (CostLevels) },
  },
  required: ["name", "numberOfMeals", "usingPreferences", "budget"],
};

export class PlanController {
  @dependency
  planService: PlanService;

  @Post("/")
  @ValidateBody(generatePlanSchema)
  @JWTOptional()
  @NonEmptyBody()
  async generatePlan(ctx: Context) {
    let name = ctx.request.body.name;
    let numberOfMeals: number = ctx.request.body.numberOfMeals;
    let budget: CostLevels = ctx.request.body.budget;
    let usingPreferences: boolean = ctx.request.body.usingPreferences;
    let preferences: PreferencesClass = usingPreferences ? ctx.request.body.preferences : emptyPrefs();

    let user = ctx.user;
    //TODO: put inside userservice.
    let userObj: any = undefined;
    if (user !== undefined) {
      userObj = await User.findOne({ username: user.username });
    }

    const response: ServiceResponse = await this.planService.generateAndSavePlanWithPreferences(
      name,
      numberOfMeals,
      preferences,
      budget,
      userObj
    );

    switch (response.code) {
      case ServiceResponseCode.ok:
        return new HttpResponseOK(response.buildResponse());
      case ServiceResponseCode.duplicateKeyInDb:
        return new HttpResponseConflict(response.buildResponse());
      default:
        return new HttpResponseInternalServerError( { text: 'Internal error' } );
    }
  }

  @Get("/")
  @ValidateQueryParam("planId", { type: "string" }, { required: true})
  @NonEmptyQuery()
  async getRecipeById(ctx: Context) {
    const planId = ctx.request.query.planId;
    const plan = await this.planService.getPlan(planId);
    if (plan === null) {
      return new HttpResponseNotFound({ text: "Plan not found" });
    } else {
      const user = await User.findById(plan.user);
      return new HttpResponseOK({
        text: "Plan found, all good so far",
        name: plan.name,
        recipes: plan.recipes,
        //TODO: filter before sending!
        author: user?.username,
      });
    }
  }
}
