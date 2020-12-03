import { prop, getModelForClass } from "@typegoose/typegoose";
import { NutritionalInfo } from "./nutritional-info.model";

export enum CostLevels {
  none = "None",
  low = "low",
  medium = "medium",
  high = "high",
}

export enum UnitsOfMeasure {
  grams = "grams",
  liters = "liters",
  pieces = "pieces",
}

export class IngredientInRecipe {
  @prop({ type: String, required: true })
  public name: String;
  @prop({ enum: UnitsOfMeasure })
  public unitOfMeasure?: UnitsOfMeasure;
  @prop({ type: Number, required: true })
  public quantity: number;
}

export class RecipeClass {
  @prop({ type: String, required: true, unique: true })
  public name: string;

  @prop({ type: Date, required: true })
  public dateModified: Date;

  @prop({ enum: CostLevels, required: true })
  public estimatedCost: CostLevels;

  @prop({ type: String, required: true })
  public image: string;

  @prop({ type: [String], required: true })
  public categories: string[];

  @prop({ type: String, required: true })
  public description: string;

  @prop({ type: Number, required: true })
  public prepTime: Number;

  @prop({ type: Number, required: true })
  public cookTime: Number;

  @prop({ type: Number, required: true })
  public totalTime: Number;

  @prop({ type: Number, required: true })
  public conservationTime: Number;

  @prop({ type: Number, required: true })
  public peopleFor: Number;

  @prop({ type: [IngredientInRecipe], required: true })
  public ingredients: IngredientInRecipe[];

  @prop({ type: [String], required: true })
  public keywords: string[];

  @prop({ type: [String], required: true })
  public lables: string[];

  @prop({ type: Number, required: true })
  public averageRating: Number;

  @prop({ type: Number, required: true })
  public numberOfRatings: Number;

  @prop({ type: NutritionalInfo, required: true })
  public nutritionalInfos: NutritionalInfo;

  @prop({ type: [String], required: true })
  public requiredTools: string[];

  public getShortInfo() {
    return {
      name: this.name,
      image: this.image,
      averageRating: this.averageRating,
      description: this.description
    }
  }

  public getCompleteInfo() {
    return {
      name: this.name,
      dateModified: this.dateModified,
      estimatedCost: this.estimatedCost,
      image: this.image,
      categories: this.categories,
      description: this.description,
      prepTime: this.prepTime,
      cookTime: this.cookTime,
      totalTime: this.totalTime,
      conservationTime: this.conservationTime,
      peopleFor: this.peopleFor,
      ingredients: this.ingredients,
      keywords: this.keywords,
      labels: this.lables,
      averageRating: this.averageRating,
      numberOfRatings: this.numberOfRatings,
      nutritionalInfos: this.nutritionalInfos,
      requiredTools: this.requiredTools
    }
  }
}

export const Recipe = getModelForClass(RecipeClass);
