import { PreferencesClass } from "../models/preferences.model";
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
import { ErrorWrapper } from "./recipe.service";

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

interface RatedRecipe {
  score: number;
  recipe: DocumentType<RecipeClass>;
}

export class PlanService {
  private MAX_ITERATIONS: number = 1000;
  private alpha: number = 1.2; // multiplicative factor for normal std
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
    return randomValue > max ? max - 1 : randomValue;
  }

  async generateAndSavePlanWithPreferences(
    name: string,
    numberOfRecipes: number,
    preferences: PreferencesClass,
    budget: CostLevels,
    user?: DocumentType<UserClass>
  ): Promise<ServiceResponse> {
    const usePref =
      preferences.positive.ingredients.length > 0 ||
      preferences.positive.labels.length > 0 ||
      preferences.positive.recipes.length > 0 ||
      preferences.negative.ingredients.length > 0 ||
      preferences.negative.labels.length > 0 ||
      preferences.negative.recipes.length > 0;

    const queryParams = {};
    if (budget !== "None") {
      queryParams["estimatedCost"] = budget;
    }

    // get recipes by cost level
    const recipes = await this.recipeService.findExactMatches(queryParams);
    let ratedRecipes: RatedRecipe[] = [];
    let numValidRecipes: number = 0;
    // give points to recipes based on preferences
    if (!(recipes instanceof ErrorWrapper)) {
      ratedRecipes = recipes.map((recipe) => {
        let score = 0;
        let invalidRecipe: boolean = false;

        if (usePref) {
          // calculate score for recipe name
          for (let positiveRecipe of preferences.positive.recipes) {
            if (recipe.name == <string>positiveRecipe) {
              score += 10;
            } else if (recipe.name.indexOf(<string>positiveRecipe) != -1) {
              score += 3;
            }
          }

          for (let negativeRecipe of preferences.negative.recipes) {
            if (recipe.name.indexOf(<string>negativeRecipe) != -1) {
              invalidRecipe = true;
            }
          }

          // calculate score for labels
          for (let label of recipe.keywords.concat(recipe.labels)) {
            if (preferences.positive.labels.indexOf(label) != -1) {
              score += 5;
            } else if (preferences.negative.labels.indexOf(label) != -1) {
              invalidRecipe = true;
            }
          }

          // calculate score for ingredients
          for (let positiveIngr of preferences.positive.ingredients) {
            // consider single/plural for ingredients
            // positiveIngr = positiveIngr.slice(0, positiveIngr.length - 1);
            for (let recipeIngr of recipe.ingredients) {
              if (recipeIngr.name.indexOf(<string>positiveIngr) != -1) {
                score += 2;
              }
            }
          }
          for (let negativeIngr of preferences.negative.ingredients) {
            // consider single/plural for ingredients
            // negativeIngr = negativeIngr.slice(0, negativeIngr.length - 1);
            for (let recipeIngr of recipe.ingredients) {
              if (recipeIngr.name.indexOf(<string>negativeIngr) != -1) {
                invalidRecipe = true;
              }
            }
          }

        } else {
          // if user is not using preferences, then set to 1
          // all the scores
          score = 1;
        }

        const result: RatedRecipe = {
          recipe: recipe,
          score: invalidRecipe ? -1 : score,
        };

        numValidRecipes += result.score > 0 ? 1 : 0;
        return result;
      });

      // in case no recipes matches preferences, choose random recipes
      if (numValidRecipes <= 0){
        numValidRecipes = recipes.length;
      } else {
        // sort in descending order by score
        ratedRecipes.sort((x, y) => y.score - x.score);
      }      
    }

    var setRandomIndexes: Set<number> = new Set<number>();
    let iteration = 0;

    // avoid repeated random generated numbers
    while (
      setRandomIndexes.size < numberOfRecipes &&
      iteration < this.MAX_ITERATIONS
    ) {
      setRandomIndexes.add(this.getRandomArbitrary(0, numValidRecipes));
      iteration++;
    }

    let plan = new Plan();
    plan.name = name;
    plan.user = user;
    plan.numRecipes = numberOfRecipes;
    plan.estimatedCost = budget;

    if (ratedRecipes.length > 0) {
      for (let i of setRandomIndexes) {
        plan.recipes.push(ratedRecipes[i].recipe._id);
      }
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
    return (await this.getPlan(planId)) ? true : false;
  }
}
