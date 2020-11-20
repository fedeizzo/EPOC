import { Context, Get, Post, HttpResponseOK, dependency, ValidateBody } from "@foal/core";
import { DocumentType } from "@typegoose/typegoose";
import { JWTOptional } from "@foal/jwt";
import { PlanService } from "../../services";
import { CostLevels, RecipeClass } from "../../models/recipe.model";

const generatePlanSchema = {
  properites: {
    numberOfMeals: { type: 'number' },
    usingPreferences: { type: 'boolean' },
    preferences: { type: 'object' },
    budget: { type: CostLevels },
  },
  required: ['numberOfMeals', 'usingPreferences'],
  type: 'object'
}


export class PlanController {
  @dependency
  planService: PlanService;

  @Post("/")
  @ValidateBody(generatePlanSchema)
  @JWTOptional()
  async generatePlan(ctx: Context) {
    let user = ctx.user;
    // user? console.log(user) : console.log("Utente generico");
    let numberOfMeals: number = ctx.request.body.numberOfMeals;
    let budget : CostLevels = ctx.request.body.budget;
    let usingPreferences: boolean = ctx.request.body.usingPreferences;
    let preferences: any = usingPreferences? ctx.request.body.preference : undefined;

    let response: DocumentType<RecipeClass>[] = [];
    response = await this.planService.getPlan(
      numberOfMeals,
      budget,
      preferences,
      user
    );
    return new HttpResponseOK(response);
  }
}
