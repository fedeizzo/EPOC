import { Context, Post, Get, HttpResponseOK, HttpResponseBadRequest, HttpResponseInternalServerError, dependency, ValidateBody } from '@foal/core';
import { JWTRequired } from '@foal/jwt';
import { UserService, FavoritesService } from '../../services';
import { ServiceResponse, ServiceResponseCode } from '../../services';

const addFavoritePlanSchema = {
  properites: {
    planId: { type: 'string' }
  },
  required: ['planId'],
  type: 'object'
}

export class FavoritesController {
  @dependency
  private userService: UserService;
  @dependency
  private favoritesService: FavoritesService;


  @JWTRequired()
  @ValidateBody(addFavoritePlanSchema)
  @Post('/add')
  async addFavoritePlan(ctx: Context) {
    const username = ctx.user.username;
    const planId = ctx.request.body.planId;
    const user = await this.userService.getUserByUsername(username);
    if (user) {
      const response: ServiceResponse = await this.favoritesService.addFavoritePlan(user, planId);
      switch (response.code) {
        case ServiceResponseCode.ok:
          return new HttpResponseOK(response.buildResponse());
        case ServiceResponseCode.elementNotFound:
          return new HttpResponseBadRequest({ text: 'This plan does not exist' });
        default:
          return new HttpResponseInternalServerError();
      }
    }
    else {
      return new HttpResponseBadRequest({ text: 'User does not exist anymore' });
    }
  }

  @JWTRequired()
  @Get('/isFavorite')
  async isFavoritePlan(ctx: Context) {
    const username = ctx.user.username;
    const planId = ctx.request.query.planId;
    const user = await this.userService.getUserByUsername(username);
    if (user) {
      const response: ServiceResponse = await this.favoritesService.isFavoritePlan(user, planId);
      switch (response.code) {
        case ServiceResponseCode.ok:
          return new HttpResponseOK({ favorite: false });
        case ServiceResponseCode.elementAlreadyInCollection:
          return new HttpResponseOK({ favorite: true });
        case ServiceResponseCode.elementNotFound:
          return new HttpResponseBadRequest();
        default:
          return new HttpResponseInternalServerError();
      }
    }
    else {
      return new HttpResponseBadRequest();
    }
  }

  @JWTRequired()
  @Get('/getFavoritePlans')
  async getFavoritePlans(ctx: Context) {
    const username = ctx.user.username;
    const user = await this.userService.getUserByUsername(username);
    if (user) {
      const response: ServiceResponse = await this.favoritesService.getFavoritePlansByUser(user);
      switch (response.code) {
        case ServiceResponseCode.ok:
          return new HttpResponseOK(response.buildResponse());
        case ServiceResponseCode.elementNotFound:
          return new HttpResponseBadRequest();
        default:
          return new HttpResponseInternalServerError();
      }
    }
    else {
      return new HttpResponseBadRequest({ text: "User not found" });
    }
  }
}
