import { User } from '../models';
import { UserClass } from '../models/user.model';
import { RecipeClass } from '../models/recipe.model';
import { RecipeService, ServiceResponse, ServiceResponseCode  } from '../services';
import { DocumentType } from '@typegoose/typegoose';
import { CostLevels } from '../models/recipe.model';
import { normal } from 'random';
import { Plan, PlanClass } from '../models/plan.model';



class PlanServiceResponse implements ServiceResponse {
  code: ServiceResponseCode;
  text: string;
  prop?: PlanClass;

  setValues = (code: ServiceResponseCode, text: string, prop?: PlanClass) => {
    this.code = code;
    this.text = text;
    this.prop = prop;
  }

  buildResponse = () => {
    return {
      content: this.prop
    }
  }
}

export class PlanService {
  private alpha: number = 1.5; // multiplicative factor for normal std
  private recipeService: RecipeService = new RecipeService();

  getRandomArbitrary(min: number, max: number): number {
    // return Math.floor(Math.random() * (max - min) + min);
    const normalDistribution: Function = normal(0, Math.sqrt(max) * this.alpha);
    const randomValue: number = Math.floor(Math.abs(normalDistribution()));
    return randomValue > max ? max : randomValue;
  }

  // TODO when preferences will be implemented change this line
  async generateAndSavePlan(name: string, numberOfRecipes: number, budget?: CostLevels, preferences?: any, user?: DocumentType<UserClass>)
    : Promise<ServiceResponse> {
    const queryParams = {};
    if (budget !== undefined && budget!=="None") {
      queryParams['estimatedCost'] = budget;
    }
    const recipes = await this.recipeService.findExactMatches(queryParams);

    const selectedRecipes: DocumentType<RecipeClass>[] = [];
    var setRandomIndexes: Set<number> = new Set<number>();
    let iteration = 0;

    // avoid repeated random generated numbers
    while (setRandomIndexes.size < numberOfRecipes && iteration < 1000) {
      setRandomIndexes.add(this.getRandomArbitrary(0, (recipes as DocumentType<RecipeClass>[]).length - 1));
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
    
    let content;
    let response : PlanServiceResponse = new PlanServiceResponse();
    try{
      content = await plan.save();
      response.setValues(ServiceResponseCode.ok, "All ok", content)
    } catch(e) {
      if( (e.toString()).indexOf('duplicate key error') > 0 ){
        response.setValues(ServiceResponseCode.duplicateKeyInDb, "Duplicate key Plan Name");
      } else {
        response.setValues(ServiceResponseCode.internalServerError, "Internal Server Error");
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
}
