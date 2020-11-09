import { prop, getModelForClass } from "@typegoose/typegoose";

export class NutritionalInfo {
  @prop({ type: String, required: true })
  public calories: number;

  @prop({ type: String, required: true })
  public carbohydrate: number;

  @prop({ type: String, required: true })
  public cholesterol: number;

  @prop({ type: String, required: true })
  public fat: number;

  @prop({ type: String, required: true })
  public fiber: number;

  @prop({ type: String, required: true })
  public saturedFat: number;

  @prop({ type: String, required: true })
  public sodium: number;

  @prop({ type: String, required: true })
  public sugar: number;
}
