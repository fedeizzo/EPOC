// 3p
import { Config } from "@foal/core";

// App
import { ServiceResponse } from ".";
import { Recipe, RecipeClass } from "../models/recipe.model";


enum RecipeResponseType {
  shortList,
  complete,
}

export class RecipeResponse implements ServiceResponse {
  public code: number;
  public text: string;
  public type: RecipeResponseType;
  public prop?: RecipeClass | RecipeClass[];

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
    prop?: RecipeClass[]
  ) => {
    this.code = code;
    this.text = text;
    prop ?  this.prop = prop : this.prop = [];
    this.type = RecipeResponseType.shortList;
  };

  buildResponseShortList = () => {
    return {
      code: this.code,
      text: this.text,
      recipes: this.prop ? (this.prop as RecipeClass[]).map((rec) => rec.getShortInfo()) : "",
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
    return this.type == RecipeResponseType.shortList ? this.buildResponseShortList() : this.buildResponseComplete(); 
  };
}

export class RecipeService {
  private uri: string = Config.getOrThrow("mongodb.uri", "string");

  async getShortRecipeList(searchString: string): Promise<RecipeResponse> {
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
        response.setValuesComplete(200, "All ok", result as RecipeClass);
      })
      .catch((error) => {
        response.setValuesComplete(500, error);
      });
    return response;
  }
}
