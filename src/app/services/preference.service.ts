import { ServiceResponse, ServiceResponseCode } from ".";
import { User } from "../models";
import { UserClass } from "../models/user.model";
import { DocumentType } from "@typegoose/typegoose";
import { emptyPrefs } from "../models/preferences.model";

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
      if (user?.preferences == null) {
        await createPreferences(user!);
      }
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
    request: SinglePreference
  ): Promise<ServiceResponse> {
    const user = await User.findOne({ username: username });
    let response: PreferenceResponse = new PreferenceResponse();

    if (user === undefined) {
      response.setValues(
        ServiceResponseCode.internalServerError,
        "Error retrieving user"
      );
    } else {
      if(user!.preferences == null || user!.preferences.positive == null){
        const valid : boolean = await createPreferences(user!);
        if(!valid){
          response.setValues(ServiceResponseCode.internalServerError, "Error creating preferences for the user")
        }
      }
      const userNegativePreferences = user!.preferences.negative;
      const userPositivePreferences = user!.preferences.positive;
      let presentInBlacklist = false;
      try {
        presentInBlacklist =
        userNegativePreferences[request.category].indexOf(request.content) >
          -1;
      } catch (_) {}

      let presentInThisList = false;
      try {
        presentInThisList =
          userPositivePreferences[request.category].indexOf(request.content) >
          -1;
      } catch (_) {}

      if (presentInBlacklist) {
        response.setValues(
          ServiceResponseCode.preferenceError,
          "You cannot insert a positive preference which is already in the blacklist"
        );
      } else if (presentInThisList) {
        response.setValues(
          ServiceResponseCode.preferenceError,
          "You already have this preference"
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
    request: SinglePreference
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
    request: SinglePreference
  ): Promise<PreferenceResponse> {
    const user = await User.findOne({ username: username });
    let response: PreferenceResponse = new PreferenceResponse();

    if (user === undefined) {
      response.setValues(
        ServiceResponseCode.internalServerError,
        "Error retrieving user"
      );
    } else {
      if(user!.preferences == null || user!.preferences.negative == undefined){
        const valid : boolean = await createPreferences(user!);
        if(!valid){
          response.setValues(ServiceResponseCode.internalServerError, "Error creating preferences for the user")
        }
      }

      const userNegativePreferences = user!.preferences.negative;
      const userPositivePreferences = user!.preferences.positive;
      let presentInWhiteList = false;
      try {
        presentInWhiteList =
          userPositivePreferences[request.category].indexOf(request.content) >
          -1;
      } catch (_) {}

      let presentInThisList = false;
      try {
        presentInThisList =
          userNegativePreferences[request.category].indexOf(request.content) >
          -1;
      } catch (_) {}

      if (presentInWhiteList) {
        response.setValues(
          ServiceResponseCode.preferenceError,
          "You cannot insert a negative preference which is already in the whitelist"
        );
      } else if (presentInThisList) {
        response.setValues(
          ServiceResponseCode.preferenceError,
          "You have already set this preference"
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
    request: SinglePreference
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


export async function createPreferences(user : DocumentType<UserClass>) : Promise<boolean> {
  user.preferences = emptyPrefs();
  try{
    await user.save();
    return true;
  } catch {
    return false;
  }
}

export class SinglePreference {
  public category: string;
  public content: string;
}
