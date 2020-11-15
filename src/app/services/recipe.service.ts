// 3p
import { Config } from "@foal/core";
import { DocumentType } from "@typegoose/typegoose";
// import {  } from 'mongoose';

// App
import { ServiceResponse } from ".";
import { Recipe, RecipeClass } from "../models/recipe.model";


function getShortInfo(docRecipe){
  return {
    name: docRecipe.name,
    image: docRecipe.image,
    averageRating: docRecipe.averageRating,
    description: docRecipe.description,
    id: docRecipe._id
  }
}

enum RecipeResponseType {
  shortList,
  complete,
}

export class RecipeResponse implements ServiceResponse {
  public code: number;
  public text: string;
  public type: RecipeResponseType;
  public prop?: RecipeClass | DocumentType<RecipeClass>[];

  setValuesComplete = (
    code: number,
    text: string,
    prop?: RecipeClass
  ) => {
    this.code = code;
    this.text = text;
    prop? this.prop = prop : this.prop = {} as RecipeClass ;
    this.type = RecipeResponseType.complete;
  };

  setValuesList = (
    code: number,
    text: string,
    prop?: DocumentType<RecipeClass>[]
  ) => {
    this.code = code;
    this.text = text;
    prop ?  this.prop = prop : this.prop = [];
    this.type = RecipeResponseType.shortList;
  };

  buildResponsePartialList = () => {
    console.log(this.prop);
    return {
      code: this.code,
      text: this.text,
      recipes: this.prop ? (this.prop as DocumentType<RecipeClass>[]).map((rec)  => getShortInfo(rec)): "",
    };
  };

  buildResponseComplete = () => {
    return {
      code: this.code,
      text: this.text,
      userInfo: this.prop ? (this.prop as RecipeClass).getCompleteInfo() : "",
    };
  };

  buildResponse = () => {
    return this.type == RecipeResponseType.shortList ? this.buildResponsePartialList() : this.buildResponseComplete(); 
  };
}

export class RecipeService {
  private uri: string = Config.getOrThrow("mongodb.uri", "string");

  async getPartialRecipeList(searchString: string): Promise<RecipeResponse> {
    const response: RecipeResponse = new RecipeResponse();

    // TODO: set as search in array
    // const query = await Recipe.find({ keywords: searchString }) // Search in array
    const query = await Recipe.find({ keywords: new RegExp(searchString) }) // Search in string
      .select("name image description averageRating")
      .limit(50)
      .exec()
      .then((result) => {
        response.setValuesList(200, "All ok", result);
      })
      .catch((error) => {
        response.setValuesList(500, error);
      });
      return response;  
    }

  async getCompleteRecipe(recipeId): Promise<RecipeResponse> {
    let response: RecipeResponse = new RecipeResponse();

    const query = await Recipe.findById(recipeId)
      .exec()
      .then((result) => {
        if(result == null){
          response.setValuesComplete(404, "Recipe not found");
        } else {
          response.setValuesComplete(200, "All ok", result as RecipeClass);
        }
      })
      .catch((error) => {
        response.setValuesComplete(500, error);
      });
    return response;
  }
}
