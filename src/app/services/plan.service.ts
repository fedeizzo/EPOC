import { User } from '../models';
import { UserClass } from '../models/user.model';
import { RecipeClass } from '../models/recipe.model';
import { RecipeService } from '../services';
import { DocumentType } from '@typegoose/typegoose';
import { CostLevels } from '../models/recipe.model';

export class PlanService {
  private recipeService: RecipeService = new RecipeService();
  // TODO when preferences will be implemented change this line
  getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  async getPlan(numberOfRecipes: number, budget?: CostLevels, preferences?: any, user?: DocumentType<UserClass>) {
    const obj = {};
    if (budget !== undefined) {
      obj['estimatedCost'] = budget;
    }
    const recipes = await this.recipeService.findExactMatches(obj);
    const selectedRecipes: DocumentType<RecipeClass>[] = [];
    for (let i = 0; i < numberOfRecipes; i++) {
      selectedRecipes.push(recipes[this.getRandomArbitrary(0, (recipes as DocumentType<RecipeClass>[]).length - 1)]);
    }
    return selectedRecipes;
  }
}
