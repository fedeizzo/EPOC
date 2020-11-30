import { ServiceResponse, ServiceResponseCode } from ".";
import { CostLevels, NegativePreferences, PositivePreferences, Preferences, PreferencesClass, User } from "../models";
import { UserClass } from "../models/user.model";
import { DocumentType } from "@typegoose/typegoose";


export class PreferenceResponse implements ServiceResponse {
  code: ServiceResponseCode;
  text: string;
  prop?: any;

  setValues = (code: ServiceResponseCode, text: string, prop?: any) => {
    this.code = code;
    this.text = text;
    if (prop) {
      this.prop = prop;
    }
  };

  buildResponse = () => {
    return {
      text: this.text,
      content: this.prop || "No content provided",
    };
  };
}

export class PreferenceService {
  public async getAllPreference(username: string): Promise<ServiceResponse> {
    const user = await User.findOne({ username: username });

    let response: PreferenceResponse = new PreferenceResponse();
    if (user === undefined) {
      response.setValues(
        ServiceResponseCode.internalServerError,
        "Error retrieving user"
      );
    } else {
      response.setValues(
        ServiceResponseCode.ok,
        "Preferences found",
        user?.preferences
      );
    }
    return response;
  }

  public async addPositivePreference(
    username: string,
    request: singlePreference
  ): Promise<ServiceResponse> {
    const user = await User.findOne({ username: username });
    let response: PreferenceResponse = new PreferenceResponse();

    if (user === undefined) {
      response.setValues(
        ServiceResponseCode.internalServerError,
        "Error retrieving user"
      );
    } else {
      if(user!.preferences == null || user!.preferences == undefined){
        const valid : boolean = await createPreferences(user!);
        if(!valid){
          response.setValues(ServiceResponseCode.internalServerError, "Error creating preferences for the user")
        }
      }
      const userNegativePreferences = user!.preferences.negative;
      const userPositivePreferences = user!.preferences.positive;
      let presentInBlacklist = false;


      if (
        userNegativePreferences![request.category].indexOf(request.content) > -1
      ) {
        presentInBlacklist = true;
      }

      if (presentInBlacklist) {
        response.setValues(
          ServiceResponseCode.preferenceError,
          "You cannot insert a positive preference which is already in the blacklist"
        );
      } else {
        if (
          userPositivePreferences[request.category].indexOf(request.content) ===
          -1
        ) {
          user!.preferences.positive[request.category].push(request.content);
          await user!.save();
        }
        response.setValues(ServiceResponseCode.ok, "Positive preference added");
      }
    }

    return response;
  }

  public async deletePositivePreference(
    username: string,
    request: singlePreference
  ): Promise<PreferenceResponse> {
    const user = await User.findOne({ username: username });
    let response: PreferenceResponse = new PreferenceResponse();

    if (user === undefined) {
      response.setValues(
        ServiceResponseCode.internalServerError,
        "Error retrieving user"
      );
    } else {
      if(user!.preferences == null || user!.preferences == undefined){
        const valid : boolean = await createPreferences(user!);
        if(!valid){
          response.setValues(ServiceResponseCode.internalServerError, "Error creating preferences for the user")
        }
      }

      const userPositivePreferences = user!.preferences.positive;
      if (
        userPositivePreferences[request.category].indexOf(request.content) ===
        -1
      ) {
        response.setValues(
          ServiceResponseCode.preferenceError,
          "You are trying to remove a positive preference that does not exist"
        );
      } else {
        user!.preferences.positive[request.category].pull(request.content);
        user!.save();
        response.setValues(
          ServiceResponseCode.ok,
          "Positive preference removed"
        );
      }
    }

    return response;
  }

  public async addNegativePreference(
    username: string,
    request: singlePreference
  ): Promise<PreferenceResponse> {
    const user = await User.findOne({ username: username });
    let response: PreferenceResponse = new PreferenceResponse();

    if (user === undefined) {
      response.setValues(
        ServiceResponseCode.internalServerError,
        "Error retrieving user"
      );
    } else {
      if(user!.preferences == null || user!.preferences == undefined){
        const valid : boolean = await createPreferences(user!);
        if(!valid){
          response.setValues(ServiceResponseCode.internalServerError, "Error creating preferences for the user")
        }
      }

      const userNegativePreferences = user!.preferences.negative;
      const userPositivePreferences = user!.preferences.positive;
      let presentInWhiteList = false;

      if (
        userPositivePreferences[request.category].indexOf(request.content) > -1
      ) {
        presentInWhiteList = true;
      }

      if (presentInWhiteList) {
        response.setValues(
          ServiceResponseCode.preferenceError,
          "You cannot insert a negative preference which is already in the whitelist"
        );
      } else {
        if (
          userNegativePreferences[request.category].indexOf(request.content) ===
          -1
        ) {
          user!.preferences.negative[request.category].push(request.content);
          await user!.save();
        }
        response.setValues(ServiceResponseCode.ok, "Negative preference added");
      }
    }

    return response;
  }

  public async deleteNegativePreference(
    username: string,
    request: singlePreference
  ): Promise<PreferenceResponse> {
    const user = await User.findOne({ username: username });
    let response: PreferenceResponse = new PreferenceResponse();

    if (user === undefined) {
      response.setValues(
        ServiceResponseCode.internalServerError,
        "Error retrieving user"
      );
    } else {
      if(user!.preferences == null || user!.preferences == undefined){
        const valid : boolean = await createPreferences(user!);
        if(!valid){
          response.setValues(ServiceResponseCode.internalServerError, "Error creating preferences for the user")
        }
      }

      const userNegativePreferences = user!.preferences.negative;
      if (
        userNegativePreferences[request.category].indexOf(request.content) ==
        -1
      ) {
        response.setValues(
          ServiceResponseCode.preferenceError,
          "You are trying to remove a negative preference that does not exist"
        );
      } else {
        user!.preferences.negative[request.category].pull(request.content);
        user!.save();
        response.setValues(
          ServiceResponseCode.ok,
          "Negative preference removed"
        );
      }
    }

    return response;
  }
}


async function createPreferences(user : DocumentType<UserClass>) : Promise<boolean> {
  let emptyPositive = new PositivePreferences();
  emptyPositive.ingredients = [];
  emptyPositive.recipes = [];
  // TODO: scommenta questo una volta che ci sono i costLevels giusti 
  // emptyPositive.priceRange = CostLevels.none;
  try{
    await emptyPositive.save();
  } catch {
    return false;
  }

  let emptyNegative = new NegativePreferences();
  emptyNegative.categories = [];
  emptyNegative.ingredients = [];
  emptyNegative.labels = [];
  emptyNegative.plans = [];
  emptyNegative.recipes = [];
  try{
    await emptyNegative.save();
  } catch {
    return false;
  }
  
  let emptyPreferences = new Preferences();
  emptyPreferences.positive = emptyPositive;
  emptyPreferences.negative = emptyNegative;
  try{
    await emptyPreferences.save();
  } catch {
    return false;
  }

  user.preferences = emptyPreferences;
  try{
    await user.save();
    return true;
  } catch {
    return false;
  }
}

class singlePreference {
  public category: "string";
  public content: "strng";
}
