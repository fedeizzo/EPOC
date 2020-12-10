import { PreferencesClass } from "./preferences.model";
import { prop, getModelForClass, Ref } from '@typegoose/typegoose';
import { PlanClass } from './plan.model';

export class UserClass {
  @prop({ type: String, required: true })
  public firstName: string;

  @prop({ type: String })
  public secondName?: string;

  @prop({ required: true, index: true, unique: true })
  public email: string;

  @prop({ required: true, index: true, unique: true })
  public username: string;

  @prop({ required: true })
  public password: string;

  @prop({ type: PreferencesClass, required: true })
  public preferences: PreferencesClass;

  @prop({ ref: 'PlanClass' })
  public favoritesPlan?: Ref<PlanClass>[];

  public getInfo() {
    return {
      firstName: this.firstName,
      secondName: this.secondName ? this.secondName : "",
      email: this.email,
      username: this.username,
    };
  }
}

export const User = getModelForClass(UserClass);
