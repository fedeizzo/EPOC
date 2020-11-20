import { ServiceResponse, ServiceResponseCode } from ".";
import { mongoose } from "@typegoose/typegoose";
import { Preferences } from "../models";

export class PreferenceResponse implements ServiceResponse {
  code: ServiceResponseCode;
  text: string;

  setValues = (code: ServiceResponseCode, text: string) => {
    this.code = code;
    this.text = text;
  };

  buildResponse = () => {
    return {
      text: this.text,
    };
  };
}

export class PreferenceService {
  public addPositivePreference(request: singlePreference): PreferenceResponse {
    // Retrieve user preferences

    // Add new preference
    // // If yet present do nothing, send back error
    // // If not present add at the end of the list, send back gg wp

    // Save

    return new PreferenceResponse();
  }

  public deletePositivePreference(request: singlePreference): PreferenceResponse {
    return new PreferenceResponse();
  }

  public addNegativePreference(request: singlePreference): PreferenceResponse {
    return new PreferenceResponse();
  }

  public deleteNegativePreference(request: singlePreference): PreferenceResponse {
    return new PreferenceResponse();
  }
}

class singlePreference {
  public category: "string";
  public content: "strng";
}
