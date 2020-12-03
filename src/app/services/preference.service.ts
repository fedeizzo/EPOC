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
    const response: PreferenceResponse = new PreferenceResponse();

    if (user == undefined) {
      /* Errore, utente non trovato */
      response.setValues(
        ServiceResponseCode.internalServerError,
        "Error retrieving user"
      );
    } else {
      if (user.preferences == null) {
        /* Utente senza preferenze */
        await createPreferences(user);
      }
      response.setValues(
        ServiceResponseCode.ok,
        "Preferences found",
        user.preferences
      );
    }
    return response;
  }

  public async addPositivePreference(
    username: string,
    request: SinglePreference
  ): Promise<ServiceResponse> {
    const user = await User.findOne({ username: username });
    const response: PreferenceResponse = new PreferenceResponse();

    if (user == undefined) {
      /* Error user not found */
      response.setValues(
        ServiceResponseCode.internalServerError,
        "Error retrieving user"
      );
    } else if (user.preferences?.positive[request.category] == null) {
      /* Error category does not exist */
      response.setValues(
        ServiceResponseCode.badRequest,
        "You are trying to add to positive preference something which is not in positive preference categories"
      );
    } else {
      if (user.preferences?.positive == null) {
        /* User without preferences */
        const valid: boolean = await createPreferences(user);
        if (!valid) {
          response.setValues(
            ServiceResponseCode.internalServerError,
            "Error creating preferences for the user"
          );
        }
      }
      const userNegativePreferences = user.preferences.negative;
      const userPositivePreferences = user.preferences.positive;

      const presentInBlacklist =
        request.category in userNegativePreferences &&
        userNegativePreferences[request.category].indexOf(request.content) > -1;

      const presentInThisList =
        userPositivePreferences[request.category].indexOf(request.content) > -1;

      if (presentInBlacklist) {
        /* preference already in blacklist */
        response.setValues(
          ServiceResponseCode.preferenceError,
          "You cannot insert a positive preference which is already in the blacklist"
        );
      } else if (presentInThisList) {
        /* preference already in positive preferences */
        response.setValues(
          ServiceResponseCode.preferenceError,
          "You already have this preference"
        );
      } else {
        /* adding new correct preference */
        if (
          userPositivePreferences[request.category].indexOf(request.content) ==
          -1
        ) {
          user.preferences.positive[request.category].push(request.content);
          await user.save();
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
    const response: PreferenceResponse = new PreferenceResponse();

    if (user == undefined) {
      /* User not found */
      response.setValues(
        ServiceResponseCode.internalServerError,
        "Error retrieving user"
      );
    } else if (user.preferences?.positive[request.category] == null) {
      /* Error category does not exist */
      response.setValues(
        ServiceResponseCode.badRequest,
        "You are trying to remove from positive preference something which is not in positive preference categories"
      );
    } else {
      if (user.preferences == undefined) {
        /* User without preferences */
        const valid: boolean = await createPreferences(user);
        if (!valid) {
          response.setValues(
            ServiceResponseCode.internalServerError,
            "Error creating preferences for the user"
          );
        }
      }

      const userPositivePreferences = user.preferences.positive;

      if (
        userPositivePreferences[request.category].indexOf(request.content) == -1
      ) {
        /* removing preference that does not exist */
        response.setValues(
          ServiceResponseCode.preferenceError,
          "You are trying to remove a positive preference that does not exist"
        );
      } else {
        /* Removing preference correctly */
        user.preferences.positive[request.category].pull(request.content);
        user.save();
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
    const response: PreferenceResponse = new PreferenceResponse();

    if (user == undefined) {
      /** User not found */
      response.setValues(
        ServiceResponseCode.internalServerError,
        "Error retrieving user"
      );
    } else if (user.preferences?.negative[request.category] == null) {
      /** Error category does not exist */
      response.setValues(
        ServiceResponseCode.badRequest,
        "You are trying to add to negative preference something which is not in negative preference categories"
      );
    } else {
      if (user.preferences?.negative == undefined) {
        /** User without preferences */
        const valid: boolean = await createPreferences(user);
        if (!valid) {
          response.setValues(
            ServiceResponseCode.internalServerError,
            "Error creating preferences for the user"
          );
        }
      }

      const userNegativePreferences = user.preferences.negative;
      const userPositivePreferences = user.preferences.positive;

      const presentInWhiteList =
        request.category in userPositivePreferences &&
        userPositivePreferences[request.category].indexOf(request.content) > -1;

      const presentInThisList =
        userNegativePreferences[request.category].indexOf(request.content) > -1;

      if (presentInWhiteList) {
        /** Error preference already in whitelist */
        response.setValues(
          ServiceResponseCode.preferenceError,
          "You cannot insert a negative preference which is already in the whitelist"
        );
      } else if (presentInThisList) {
        /** Error preference already in blacklist */
        response.setValues(
          ServiceResponseCode.preferenceError,
          "You have already set this preference"
        );
      } else {
        /** Adding correctly negative preference */
        if (
          userNegativePreferences[request.category].indexOf(request.content) == -1
        ) {
          user.preferences.negative[request.category].push(request.content);
          await user.save();
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
    const response: PreferenceResponse = new PreferenceResponse();

    if (user == undefined) {
      /** User not found */
      response.setValues(
        ServiceResponseCode.internalServerError,
        "Error retrieving user"
      );
    } else if (user.preferences?.negative[request.category] == null) {
      /** Error category des not exist  */
      response.setValues(
        ServiceResponseCode.badRequest,
        "You are trying to remove from negative preference something which is not in negative preference categories"
      );
    } else {
      if (user.preferences == undefined) {
        /** User without preferences */
        const valid: boolean = await createPreferences(user);
        if (!valid) {
          response.setValues(
            ServiceResponseCode.internalServerError,
            "Error creating preferences for the user"
          );
        }
      }

      const userNegativePreferences = user.preferences.negative;
      if (userNegativePreferences[request.category].indexOf(request.content)==-1) {
        /** Error preference does not exist */
        response.setValues(
          ServiceResponseCode.preferenceError,
          "You are trying to remove a negative preference that does not exist"
        );
      } else {
        /** Removing correctly negative preference */
        user.preferences.negative[request.category].pull(request.content);
        user.save();
        response.setValues(
          ServiceResponseCode.ok,
          "Negative preference removed"
        );
      }
    }

    return response;
  }
}

export async function createPreferences(
  user: DocumentType<UserClass>
): Promise<boolean> {
  user.preferences = emptyPrefs();
  try {
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
