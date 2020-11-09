import { hashPassword } from '@foal/core';
import { model, models, Schema } from 'mongoose';
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
  private password?: string;

  public async setPassword(this: DocumentType<UserClass>, password: string) {
    this.password = await hashPassword(password);
  }
};

export const User = getModelForClass(UserClass);
