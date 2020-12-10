import { UserClass } from "../models/user.model";
import { RecipeClass } from "../models/recipe.model";
import {
  RecipeService,
  ServiceResponse,
  ServiceResponseCode,
} from "../services";
import { DocumentType } from "@typegoose/typegoose";
import { CostLevels } from "../models/recipe.model";
import { normal } from "random";
import { Plan, PlanClass } from "../models/plan.model";

class PlanServiceResponse implements ServiceResponse {
  code: ServiceResponseCode;
  text: string;
  prop?: PlanClass | PlanClass[];

  setValues = (
    code: ServiceResponseCode,
    text: string,
    prop?: PlanClass | PlanClass[]
  ) => {
    this.code = code;
    this.text = text;
    this.prop = prop;
  };

  buildResponse = () => {
    return {
      text: this.text,
      plan: this.prop ? this.prop : "No plan",
    };
  };
}

export class PlanService {
  private MAX_ITERATIONS: number = 1000;
  private alpha: number = 1.5; // multiplicative factor for normal std
  private recipeService: RecipeService = new RecipeService();
  static queryLimit = 100;
  static fieldsToSelect = [
    "name",
    "user",
    "numRecipes",
    "estimatedCost",
    "recipes",
  ];

  getRandomArbitrary(min: number, max: number): number {
    // return Math.floor(Math.random() * (max - min) + min);
    const normalDistribution: Function = normal(0, Math.sqrt(max) * this.alpha);
    const randomValue: number = Math.floor(Math.abs(normalDistribution()));
    return randomValue > max ? max : randomValue;
  }

  // TODO when preferences will be implemented change this line
  async generateAndSavePlan(
    name: string,
    numberOfRecipes: number,
    budget?: CostLevels,
    preferences?: any,
    user?: DocumentType<UserClass>
  ): Promise<ServiceResponse> {
    const queryParams = {};
    if (budget !== undefined && budget !== "None") {
      queryParams["estimatedCost"] = budget;
    }
    const recipes = await this.recipeService.findExactMatches(queryParams);

    const selectedRecipes: DocumentType<RecipeClass>[] = [];
    var setRandomIndexes: Set<number> = new Set<number>();
    let iteration = 0;

    // avoid repeated random generated numbers
    while (
      setRandomIndexes.size < numberOfRecipes &&
      iteration < this.MAX_ITERATIONS
    ) {
      setRandomIndexes.add(
        this.getRandomArbitrary(
          0,
          (recipes as DocumentType<RecipeClass>[]).length - 1
        )
      );
      iteration++;
    }

    let plan = new Plan();
    plan.name = name;
    plan.user = user;
    plan.numRecipes = numberOfRecipes;
    plan.estimatedCost = budget;

    for (let i of setRandomIndexes) {
      plan.recipes.push(recipes[i]);
    }

    let response: PlanServiceResponse = new PlanServiceResponse();
    try {
      const content = await plan.save();
      response.setValues(ServiceResponseCode.ok, "All ok", content);
    } catch (e) {
      if (e.toString().indexOf("duplicate key error") > 0) {
        response.setValues(
          ServiceResponseCode.duplicateKeyInDb,
          "Error: duplicate plan name"
        );
      } else {
        response.setValues(
          ServiceResponseCode.internalServerError,
          "Internal Server Error"
        );
      }
    }

    return response;
  }

  async getPlan(planId: string) {
    try {
      const plan = await Plan.findById(planId);
      return plan;
    } catch (_) {
      return null;
    }
  }

  async getPlansByName(query: String) {
    const response: PlanServiceResponse = new PlanServiceResponse();
    let result = await this.searchExactMatches(query);
    if (!(result instanceof String) && result.length < PlanService.queryLimit) {
      const s = new Set(result.map((p) => p.id));
      const moreResults = await this.searchRemainingWithRegex(
        query,
        PlanService.queryLimit - result.length
      );
      result.push(...moreResults.filter((r) => !s.has(r.id)));
    }
    if (result instanceof String) {
      response.setValues(
        ServiceResponseCode.internalServerError,
        "Error while querying the db for a list of plans:\n" + result
      );
    } else {
      response.setValues(ServiceResponseCode.ok, "All ok", result);
    }
    return response;
  }

  private async searchExactMatches(
    searchString: String
  ): Promise<DocumentType<PlanClass>[]> {
    return await Plan.find({
      name: new RegExp(`\\b${searchString}\\b`, "i"),
    })
      .select(PlanService.fieldsToSelect)
      .limit(PlanService.queryLimit)
      .exec()
      .catch((e: any) => e);
  }

  private async searchRemainingWithRegex(
    searchString: String,
    remaining: number
  ): Promise<DocumentType<PlanClass>[]> {
    return await Plan.find({
      name: new RegExp(searchString.valueOf(), "i"),
    })
      .select(PlanService.fieldsToSelect)
      .limit(remaining)
      .exec()
      .catch((_: any) => []);
  }
  async doesPlanExist(planId: string) {
    return await this.getPlan(planId) ? true : false;
  }
}
