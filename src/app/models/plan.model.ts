import { prop, DocumentType, getModelForClass, Ref } from '@typegoose/typegoose'
import { CostLevels, RecipeClass } from './recipe.model';
import { UserClass } from './user.model';

export class PlanClass {
  @prop({ required: true, index: true, unique: true })
  public name: string;

  @prop({ ref: UserClass })
  public user?: Ref<UserClass>;

  @prop({ required: true })
  public numRecipes: number;

  @prop({ enum: CostLevels, required: true })
  public estimatedCost?: CostLevels;

  @prop({ required: true, ref: RecipeClass })
  public recipes: Ref<RecipeClass>[];

  public getInfo() {
    return {
      name: this.name,
      user: this.user ? this.user : "",
      numRecipes: this.numRecipes,
      estimatedCost: this.estimatedCost ? this.estimatedCost : "",
    };
  }
};

export const Plan = getModelForClass(PlanClass);
