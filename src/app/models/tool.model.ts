import { prop, getModelForClass } from "@typegoose/typegoose";

class ToolClass {
  @prop({ type: String, required: true, unique: true })
  public name: string;
}

export const Tool = getModelForClass(ToolClass);
