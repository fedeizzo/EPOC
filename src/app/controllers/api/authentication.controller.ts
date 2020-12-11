import {
  Config, Context, Post, ValidateBody, HttpResponseNotFound,
  HttpResponseOK, Delete, HttpResponseUnauthorized, HttpResponseInternalServerError,
  HttpResponse, HttpResponseForbidden, HttpResponseConflict
} from '@foal/core';
import { sign } from 'jsonwebtoken';
import { JWTRequired } from '@foal/jwt';

// App
import { UserService, ServiceResponse, ServiceResponseCode } from '../../services';
import { emptyPrefs } from '../../models/preferences.model';

const signupSchema = {
  properites: {
    firstName: { type: 'string' },
    secondName: { type: 'string' },
    email: { type: 'string' },
    username: { type: 'string' },
    password: { type: 'string' },
  },
  required: ['firstName', 'email', 'username', 'password'],
  type: 'object'
}

const loginSchema = {
  properites: {
    username: { type: 'string' },
    password: { type: 'string' },
  },
  required: ['username', 'password'],
  type: 'object'
}

export class AuthenticationController {
  private userService: UserService = new UserService();

  @Post('/signup')
  @ValidateBody(signupSchema)
  async signupCheck(ctx: Context) {
    const firstName:string = ctx.request.body.firstName;
    const secondName:string = ctx.request.body.secondName;
    const email:string = ctx.request.body.email;
    const username:string = ctx.request.body.username;
    const password:string = ctx.request.body.password;

    const serviceResponse: ServiceResponse = await this.userService.insertUser(
      firstName,
      email,
      username,
      password,
      emptyPrefs(),
      secondName,
    );

    let httpResponse: HttpResponse;
    switch (serviceResponse.code) {
      case ServiceResponseCode.ok:
        httpResponse = new HttpResponseOK(serviceResponse.buildResponse());
        break;
      case ServiceResponseCode.passwordTooCommon:
        httpResponse = new HttpResponseForbidden(serviceResponse.buildResponse());
        break;
      case ServiceResponseCode.duplicateKeyInDb:
        httpResponse = new HttpResponseConflict(serviceResponse.buildResponse());
        break;
      case ServiceResponseCode.internalServerError:
      default:
        httpResponse = new HttpResponseInternalServerError();
        break;
    }

    return httpResponse;
  }

  @Post('/login')
  @ValidateBody(loginSchema)
  async loginCheck(ctx: Context) {
    const username: string = ctx.request.body.username;
    const password: string = ctx.request.body.password;
    const serviceResponse: ServiceResponse = await this.userService.areValidCredentials(
      username, password
    );

    let httpResponse: HttpResponse;
    switch (serviceResponse.code) {
      case ServiceResponseCode.ok:
        // generate new jwt
        const token = sign(
          { username: username },
          Config.get<string>('settings.jwt.secretOrPublicKey'),
          { expiresIn: '1h' }
        );
        httpResponse = new HttpResponseOK(serviceResponse.buildResponse());

        // set cookie expiring time equals to jwt expiring time
        httpResponse.setCookie('JWT', token, {
          maxAge: 3600,
          // secure: true,   // requires https to be sent
          sameSite: 'lax' // should be default on modern browsers
        });
        break;
      case ServiceResponseCode.wrongCredentials:
        httpResponse = new HttpResponseUnauthorized(serviceResponse.buildResponse());
        break;
      case ServiceResponseCode.elementNotFound:
        httpResponse = new HttpResponseNotFound(serviceResponse.buildResponse());
        break;
      default:
        httpResponse = new HttpResponseInternalServerError();
        break;
    }

    return httpResponse;
  }

  @Post('/logout')
  @JWTRequired()
  async logout(ctx: Context) {
    const res = new HttpResponseOK();
    res.setCookie('JWT', '');
    return res;
  }

  @JWTRequired()
  @Delete('/user')
  @ValidateBody(loginSchema)
  async deleteUser(ctx: Context) {
    const username = ctx.request.body.username;
    const password = ctx.request.body.password;

    if (username === ctx.user.username) {
      const serviceResponse: ServiceResponse = await this.userService.deleteUser(
        username, password
      );

      let httpResponse: HttpResponse;
      switch (serviceResponse.code) {
        case ServiceResponseCode.ok:
          httpResponse = new HttpResponseOK(serviceResponse.buildResponse());
          httpResponse.setCookie('JWT', '');
          break;
        case ServiceResponseCode.wrongCredentials:
          httpResponse = new HttpResponseUnauthorized(serviceResponse.buildResponse());
          break;
        case ServiceResponseCode.elementNotFound:
          httpResponse = new HttpResponseNotFound(serviceResponse.buildResponse());
          break;
        default:
          httpResponse = new HttpResponseInternalServerError();
          break;
      }

      return httpResponse;
    }
    
    return new HttpResponseUnauthorized({
      text: "User credentials do not match with your JWT"
    });
  }
}
