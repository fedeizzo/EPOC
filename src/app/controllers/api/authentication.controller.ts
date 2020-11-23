import {
  Config, Context, Get, Post, ValidateBody, HttpResponseNotFound, render,
  HttpResponseOK, Delete, HttpResponseUnauthorized, HttpResponseInternalServerError,
  HttpResponse, HttpResponseForbidden, HttpResponseConflict
} from '@foal/core';
import { sign } from 'jsonwebtoken';
import { JWTRequired } from '@foal/jwt';

// App
import { UserService, ServiceResponse, ServiceResponseCode } from '../../services';
import { RefreshJWT } from '../../hooks';

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

  // === Rest API ===
  @Post('/signup')
  @ValidateBody(signupSchema)
  async signupCheck(ctx: Context) {
    const firstName = ctx.request.body.firstName;
    const secondName = ctx.request.body.secondName;
    const email = ctx.request.body.email;
    const username = ctx.request.body.username;
    const password = ctx.request.body.password;
    const serviceResponse: ServiceResponse = await this.userService.insertUser(
      firstName, email, username, password, secondName
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
      default:
        httpResponse = new HttpResponseInternalServerError();
        break;
    }

    return httpResponse;
  }

  @Post('/login')
  @ValidateBody(loginSchema)
  async loginCheck(ctx: Context) {
    const username = ctx.request.body.username;
    const password = ctx.request.body.password;
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

  @JWTRequired()
  @Post('/logout')
  async logout(ctx: Context) {
    const res = new HttpResponseOK();
    res.setCookie('JWT', '');
    return res;
  }

  @JWTRequired()
  @Delete('/deleteUser')
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

    return new HttpResponseUnauthorized("User credentials do not match with your JWT");
  }
}