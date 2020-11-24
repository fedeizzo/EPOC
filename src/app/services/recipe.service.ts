// 3p
import { Config } from "@foal/core";
import { DocumentType } from "@typegoose/typegoose";

// App
import { ServiceResponse, ServiceResponseCode } from ".";
import { Recipe, RecipeClass } from "../models/recipe.model";

function getShortInfo(docRecipe) {
  return {
    name: docRecipe.name,
    image: docRecipe.image,
    averageRating: docRecipe.averageRating,
    description: docRecipe.description,
    id: docRecipe._id,
  };
}

enum RecipeResponseType {
  shortList,
  complete,
}

export class RecipeResponse implements ServiceResponse {
  public code: ServiceResponseCode;
  public text: string;
  public type: RecipeResponseType;
  public prop?: RecipeClass | DocumentType<RecipeClass>[];

  setValuesComplete = (
    code: ServiceResponseCode,
    text: string,
    prop?: RecipeClass
  ) => {
    this.code = code;
    this.text = text;
    prop ? (this.prop = prop) : (this.prop = {} as RecipeClass);
    this.type = RecipeResponseType.complete;
  };

  setValuesList = (
    code: ServiceResponseCode,
    text: string,
    prop?: DocumentType<RecipeClass>[]
  ) => {
    this.code = code;
    this.text = text;
    prop ? (this.prop = prop) : (this.prop = []);
    this.type = RecipeResponseType.shortList;
  };

  buildResponsePartialList() {
    return {
      text: this.text,
      recipes: this.prop
        ? (this.prop as DocumentType<RecipeClass>[]).map((rec) =>
            getShortInfo(rec)
          )
        : "",
    };
  }

  buildResponseComplete() {
    return {
      text: this.text,
      recipe: this.prop ? (this.prop as RecipeClass).getCompleteInfo() : "",
    };
  }

  buildResponse() {
    return this.type == RecipeResponseType.shortList
      ? this.buildResponsePartialList()
      : this.buildResponseComplete();
  }
}

class ErrorWrapper {
  constructor(error: any) {
    this.error = error;
  }
  error: any;
}

export class RecipeService {
  private static fieldsToSelect = "name image description averageRating";
  private static queryLimit = 50;

  async getPartialRecipeList(searchString: string): Promise<RecipeResponse> {
    const response: RecipeResponse = new RecipeResponse();
    let result = await this.searchExactMatches(searchString);
    if (
      !(result instanceof ErrorWrapper) &&
      result.length < RecipeService.queryLimit
    ) {
      const set = new Set<DocumentType<RecipeClass>>();
      result.forEach((i) => set.add(i));
      const moreResults = await this.searchRemainingWithRegex(
        searchString,
        RecipeService.queryLimit - result.length
      );
      moreResults.forEach((i) => set.add(i));
      result = Array.from(set);
    }
    if (result instanceof ErrorWrapper) {
      response.setValuesList(
        ServiceResponseCode.internalServerError,
        "Error while queryiung the db for a list of recipes:\n" + result.error
      );
    } else {
      response.setValuesList(ServiceResponseCode.ok, "All ok", result);
    }
    return response;
  }

  private async searchRemainingWithRegex(
    searchString: string,
    remaining: number
  ) {
    return await Recipe.find({
      keywords: new RegExp(searchString),
    })
      .select(RecipeService.fieldsToSelect)
      .limit(remaining)
      .exec()
      .catch((_) => []);
  }

  private async searchExactMatches(searchString: string) {
    return await Recipe.find({
      keywords: searchString,
    })
      .select(RecipeService.fieldsToSelect)
      .limit(RecipeService.queryLimit)
      .exec()
      .catch((e) => new ErrorWrapper(e));
  }

  async getCompleteRecipe(recipeId): Promise<RecipeResponse> {
    let response: RecipeResponse = new RecipeResponse();

    await Recipe.findById(recipeId)
      .exec()
      .then((result) => {
        if (result == null) {
          response.setValuesComplete(
            ServiceResponseCode.elementNotFound,
            "Recipe not found"
          );
        } else {
          response.setValuesComplete(
            ServiceResponseCode.ok,
            "All ok",
            result as RecipeClass
          );
        }
      })
      .catch((error) => {
        const message: String = error.message;
        if (message.startsWith("Cast to ObjectId failed for value")) {
          response.setValuesComplete(
            ServiceResponseCode.elementNotFound,
            "Recipe not found"
          );
        } else {
          response.setValuesComplete(
            ServiceResponseCode.internalServerError,
            "Error while looking for recipe in db:\n" + error
          );
        }
      });
    return response;
  }

  public async findExactMatches(queryFields: object) {
    return await Recipe.find(queryFields)
      .select(RecipeService.fieldsToSelect)
      .sort({ numberOfRatings: -1 })
      .exec()
      .catch((e) => new ErrorWrapper(e));
  }
}
