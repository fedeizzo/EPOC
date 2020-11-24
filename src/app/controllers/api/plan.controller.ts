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
import { User, CostLevels } from "../../models";


const generatePlanSchema = {
  properites: {
    name: { type: "string" },
    numberOfMeals: { type: "number" },
    usingPreferences: { type: "boolean" },
    preferences: { type: "object" },
    budget: { type: typeof (CostLevels) },
  },
  required: ["numberOfMeals", "usingPreferences"],
};

export class PlanController {
  @dependency
  planService: PlanService;

  @Post("/generate")
  @ValidateBody(generatePlanSchema)
  @JWTOptional()
  async generatePlan(ctx: Context) {
    const json = JSON.parse(ctx.request.body);
    let name = json.name;
    let numberOfMeals: number = json.numberOfMeals;
    let budget: CostLevels = json.budget;
    let usingPreferences: boolean = json.usingPreferences;
    let preferences: any = usingPreferences ? json.preference : undefined;

    let user = ctx.user;
    //TODO: put inside userservice.
    let userObj: any = undefined;
    if (user !== undefined) {
      userObj = (await User.find({ username: user.username }))[0];
    }

    let response: ServiceResponse = await this.planService.generateAndSavePlan(
      name,
      numberOfMeals,
      budget,
      preferences,
      userObj
    );

    switch (response.code) {
      case ServiceResponseCode.ok:
        return new HttpResponseOK(response.buildResponse());
      case ServiceResponseCode.duplicateKeyInDb:
        return new HttpResponseConflict(response.buildResponse());
      default:
        return new HttpResponseInternalServerError();
    }
  }

  @Get("/get")
  @ValidateQueryParam("planId", { type: "string" }, { required: true })
  async getRecipeById(ctx: Context) {
    const planId = ctx.request.query.planId;
    const plan = await this.planService.getPlan(planId);
    if (plan === null) {
      return new HttpResponseNotFound();
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
