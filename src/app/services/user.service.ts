// 3p
import { Config, hashPassword, verifyPassword } from '@foal/core';
import { isCommon } from '@foal/password'
import { connect, disconnect } from 'mongoose';

// App
import { User } from '../models'
import { UserClass } from '../models/user.model';
import { ServiceResponse } from '../services';

class UserServiceResponse implements ServiceResponse {
  code: number;
  text: string;
  prop?: UserClass;

  setValues = (code: number, text: string, prop?: UserClass) => {
    this.code = code;
    this.text = text;
    this.prop = prop;
  }

  buildResponse = () => {
    return {
      code: this.code,
      text: this.text,
      userInfo: this.prop ? this.prop.getInfo() : ""
    }
  }
}

export class UserService {
  private uri: string = Config.getOrThrow('mongodb.uri', 'string');

  async insertUser(firstName: string, email: string, username: string, password: string, secondName?: string): Promise<UserServiceResponse> {
    let response: UserServiceResponse = new UserServiceResponse();

    if (await isCommon(password)) {
      response.setValues(300, "Password too common");
    } else {
      await connect(this.uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

      const user = new User();
      user.firstName = firstName;
      user.secondName = secondName;
      user.email = email;
      user.username = username;
      user.password = await (hashPassword(password));

      try {
        await user.save();
        response.setValues(200, "OK", user);
      } catch (error) {
        response.setValues(301, "Db error, probably duplicate key");
        console.error(error.message);
      }

      await disconnect();
    }
    return response;
  }

  async areValidCredentials(username: string, password: string): Promise<UserServiceResponse> {
    let response: UserServiceResponse = new UserServiceResponse();

    await connect(this.uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
    const doc = await User.findOne({ username: username });
    await disconnect();

    if (doc != undefined) {
      let isValidPassword: boolean = await verifyPassword(password, doc.password);
      if (isValidPassword) {
        response.setValues(200, "User found, right credentials", doc);
      } else {
        response.setValues(302, "User found, wrong credentials");
      }
    } else {
      response.setValues(303, "User not found, probably");
    }

    return response;
  }

  // TODO: we are doing two calls to the db: we can do it better
  async deleteUser(username: string, password: string): Promise<UserServiceResponse> {
    let response: UserServiceResponse = await this.areValidCredentials(username, password);
    
    if (response.code === 200){
      await connect(this.uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
      const doc = await User.findOneAndDelete({ username: username});
      await disconnect();
      if (doc != undefined){
        response.setValues(200, "User deleted definitively", doc ? doc : undefined);
      } else {
        response.setValues(303, "Error deleting the user");
      }
    }

    return response;
  }

}
