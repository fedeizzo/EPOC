import { Config, Context, Get, Post, ValidateBody, HttpResponseNotFound, render, HttpResponseRedirect, HttpResponseBadRequest, HttpResponseOK } from '@foal/core';
import { sign } from 'jsonwebtoken';
import { JWTOptional } from '@foal/jwt';

// App
import { UserService, ServiceResponse } from '../services';
import { RefreshJWT } from '../hooks';

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

// @RefreshJWT()
@JWTOptional()
export class AuthenticationController {
  private userService: UserService = new UserService();

  @Get('/signup')
  async signup(ctx: Context) {
    if (!ctx.request.accepts('html')) {
      return new HttpResponseNotFound();
    }

    return await render('./public/signup.html');
  }

  @Post('/signup')
  @ValidateBody(signupSchema)
  async signupCheck(ctx: Context) {
    const firstName = ctx.request.body.firstName;
    const secondName = ctx.request.body.secondName;
    const email = ctx.request.body.email;
    const username = ctx.request.body.username;
    const password = ctx.request.body.password;
    const response: ServiceResponse = await this.userService.insertUser(firstName, email, username, password, secondName);

    if (response.code === 200) {
      return new HttpResponseRedirect('/');
    } else {
      return new HttpResponseBadRequest(response.buildResponse());
    }
  }

  @Get('/login')
  async login(ctx: Context) {
    if (!ctx.request.accepts('html')) {
      return new HttpResponseNotFound();
    }

    return await render('./public/login.html');
  }

  @Post('/login')
  // @ValidateBody(loginSchema)
  async loginCheck(ctx: Context) {
    if (ctx.user) {
      console.log("ciao")
      const res = new HttpResponseRedirect("/");
      return res;
    } else {
      const username = ctx.request.body.username;
      const password = ctx.request.body.password;
      const response: ServiceResponse = await this.userService.areValidCredentials(username, password);


      if (response.code === 200) {
        const token = sign(
          { username: username },
          Config.get<string>('settings.jwt.secretOrPublicKey'),
          { expiresIn: '1h' }
        );
        const res = new HttpResponseRedirect("/");
        // TODO
        // .setCookie('sessionID', 'xxxx', {
        //   domain: 'example.com',
        //   // expires: new Date(2020, 12, 12),
        // });
        // res.setCookie('JWT', token, {
        //   httpOnly: true,
        //   maxAge: 3600,
        //   path: '/',
        //   secure: true,
        //   sameSite: 'lax',
        // });
        res.setCookie('JWT', token);
        console.log("res: ", res);
        return res;
      } else {
        return new HttpResponseBadRequest(response.buildResponse());
      }
    }
  }

}
