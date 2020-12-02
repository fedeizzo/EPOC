// 3p
import { Config, hashPassword, verifyPassword } from "@foal/core";
import { isCommon } from "@foal/password";
import { connect, disconnect } from "mongoose";

// App
import { PreferencesClass, User } from "../models";
import { UserClass } from "../models/user.model";
import { ServiceResponse, ServiceResponseCode } from "../services";

class UserServiceResponse implements ServiceResponse {
  code: ServiceResponseCode;
  text: string;
  prop?: UserClass;

  setValues = (code: ServiceResponseCode, text: string, prop?: UserClass) => {
    this.code = code;
    this.text = text;
    this.prop = prop;
  };

  buildResponse = () => {
    return {
      text: this.text,
      userInfo: this.prop ? this.prop.getInfo() : "",
    };
  };
}

export class UserService {
  private uri: string = Config.getOrThrow("mongodb.uri", "string");

  async insertUser(
    firstName: string,
    email: string,
    username: string,
    password: string,
    preferences: PreferencesClass,
    secondName?: string
  ): Promise<UserServiceResponse> {
    let response: UserServiceResponse = new UserServiceResponse();

    if (await isCommon(password)) {
      response.setValues(
        ServiceResponseCode.passwordTooCommon,
        "Password too common"
      );
    } else {
      // await connect(this.uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

      const user = new User();
      user.firstName = firstName;
      user.secondName = secondName;
      user.email = email;
      user.username = username;
      user.password = await hashPassword(password);
      user.preferences = preferences;

      try {
        await user.save();
        response.setValues(ServiceResponseCode.ok, "OK", user);
      } catch (error) {
        if ((error.toString()).indexOf('duplicate key error') > 0) {
          response.setValues(
            ServiceResponseCode.duplicateKeyInDb,
            "Db error, probably duplicate key");
        } else {
          response.setValues(
            ServiceResponseCode.internalServerError,
            "Internal Server Error");
        }
      }
      // await disconnect();
    }

    return response;
  }

  async areValidCredentials(
    username: string,
    password: string
  ): Promise<UserServiceResponse> {
    let response: UserServiceResponse = new UserServiceResponse();

    // await connect(this.uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
    const doc = await User.findOne({ username: username });
    // await disconnect();

    if (doc != undefined) {
      let isValidPassword: boolean = await verifyPassword(
        password,
        doc.password
      );
      if (isValidPassword) {
        response.setValues(
          ServiceResponseCode.ok,
          "User found, right credentials",
          doc
        );
      } else {
        response.setValues(
          ServiceResponseCode.wrongCredentials,
          "User found, wrong credentials"
        );
      }
    } else {
      response.setValues(
        ServiceResponseCode.elementNotFound,
        "User not found, probably"
      );
    }

    return response;
  }

  // TODO: we are doing two calls to the db: we can do it better
  async deleteUser(
    username: string,
    password: string
  ): Promise<UserServiceResponse> {
    let response: UserServiceResponse = await this.areValidCredentials(
      username,
      password
    );

    if (response.code === ServiceResponseCode.ok) {
      // await connect(this.uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
      const doc = await User.findOneAndDelete({ username: username });
      // await disconnect();
      if (doc != undefined) {
        response.setValues(
          ServiceResponseCode.ok,
          "User deleted definitively",
          doc ? doc : undefined
        );
      } else {
        response.setValues(304, "Error deleting the user");
      }
    }

    return response;
  }
}
