import { prop, DocumentType, getModelForClass, Ref } from '@typegoose/typegoose'
import { PreferencesClass } from './preferences.model';
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

  @prop({ type: PreferencesClass, required: true })
  public preferences: PreferencesClass;

  // public getInfo() {
  //   return {
  //     firstName: this.firstName,
  //     secondName: this.secondName ? this.secondName : "",
  //     email: this.email,
  //     username: this.username
  //   };
  // }
};

export const Plan = getModelForClass(PlanClass);
