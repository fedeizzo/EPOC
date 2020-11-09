import { prop, DocumentType, getModelForClass } from '@typegoose/typegoose'

class UserClass {
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
};

export const User = getModelForClass(UserClass);
