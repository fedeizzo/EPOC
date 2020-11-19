import { Preferences } from "../models";
import { ServiceResponse, ServiceResponseCode } from ".";
import { mongoose } from "@typegoose/typegoose";

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
  public addPreferences(request: singlePreference[]): PreferenceResponse {
    // Retrieve user preferences

    // Add new preferences
    // // If yet present do nothing, send back error
    // // If not present add at the end of the list, send back gg wp

    // Save

    return new PreferenceResponse();
  }
}

class singlePreference {
  public category: "string";
  public content: "strng";
}
