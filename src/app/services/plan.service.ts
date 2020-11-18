import { User } from '../models';
import { UserClass } from '../models/user.model';
import { RecipeClass } from '../models/recipe.model';
import { RecipeService } from '../services';
import { DocumentType } from '@typegoose/typegoose';
import { CostLevels } from '../models/recipe.model';
import { normal } from 'random';

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
  async getPlan(numberOfRecipes: number, budget?: CostLevels, preferences?: any, user?: DocumentType<UserClass>)
    : Promise<DocumentType<RecipeClass>[]> {
    const queryParams = {};
    if (budget !== undefined) {
      queryParams['estimatedCost'] = budget;
    }
    const recipes = await this.recipeService.findExactMatches(queryParams);

    const selectedRecipes: DocumentType<RecipeClass>[] = [];
    var setRandomIndexes: Set<number> = new Set<number>();

    // avoid repeated random generated numbers
    while (setRandomIndexes.size < numberOfRecipes) {
      setRandomIndexes.add(this.getRandomArbitrary(0, (recipes as DocumentType<RecipeClass>[]).length - 1));
    }

    for (let i of setRandomIndexes) {
      selectedRecipes.push(recipes[i]);
    }

    return selectedRecipes;
  }
}
