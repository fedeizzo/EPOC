import {
  Context,
  Get,
  Post,
  Delete,
  HttpResponseOK,
  ValidateBody,
  HttpResponseInternalServerError,
  HttpResponseConflict,
  HttpResponseNotFound,
  HttpResponseBadRequest,
} from "@foal/core";
import { JWTRequired } from "@foal/jwt";
import { PreferenceService } from "../../services/preference.service";
import {
  ServiceResponse,
  ServiceResponseCode,
} from "../../services/response.service";

const preferenceSchema = {
  properites: {
    category: { type: "string" },
    content: { type: "string" },
  },
  required: ["category", "content"],
  type: "object",
};

export class PreferenceController {
  private preferenceService = new PreferenceService();

  @Get("/")
  @JWTRequired()
  async getAllPreferences(ctx: Context) {
    const username = ctx.user.username;

    const response: ServiceResponse = await this.preferenceService.getAllPreference(
      username
    );
    switch (response.code) {
      case ServiceResponseCode.ok:
        return new HttpResponseOK(response.buildResponse());
      case ServiceResponseCode.internalServerError:
        return new HttpResponseInternalServerError(response.buildResponse());
    }
  }

  @Post("/positive")
  @ValidateBody(preferenceSchema)
  @JWTRequired()
  async addPositivePreference(ctx: Context) {
    const username = ctx.user.username;
    const request = ctx.request.body;

    const response: ServiceResponse = await this.preferenceService.addPositivePreference(
      username,
      request
    );
    switch (response.code) {
      case ServiceResponseCode.ok:
        return new HttpResponseOK(response.buildResponse());
      case ServiceResponseCode.preferenceError:
        return new HttpResponseConflict(response.buildResponse());
      case ServiceResponseCode.badRequest:
        return new HttpResponseBadRequest(response.buildResponse());
      default:
        return new HttpResponseInternalServerError(response.buildResponse());
    }
  }

  @Delete("/positive")
  @ValidateBody(preferenceSchema)
  @JWTRequired()
  async deletePositivePreference(ctx: Context) {
    const username = ctx.user.username;
    const request = ctx.request.body;

    const response: ServiceResponse = await this.preferenceService.deletePositivePreference(
      username,
      request
    );
    switch (response.code) {
      case ServiceResponseCode.ok:
        return new HttpResponseOK(response.buildResponse());
      case ServiceResponseCode.preferenceError:
        return new HttpResponseNotFound(response.buildResponse());
      case ServiceResponseCode.badRequest:
        return new HttpResponseBadRequest(response.buildResponse());
      default:
        return new HttpResponseInternalServerError(response.buildResponse());
    }
  }

  @Post("/negative")
  @ValidateBody(preferenceSchema)
  @JWTRequired()
  async addNegativePreference(ctx: Context) {
    const username = ctx.user.username;
    const request = ctx.request.body;

    const response: ServiceResponse = await this.preferenceService.addNegativePreference(
      username,
      request
    );
    switch (response.code) {
      case ServiceResponseCode.ok:
        return new HttpResponseOK(response.buildResponse());
      case ServiceResponseCode.preferenceError:
        return new HttpResponseConflict(response.buildResponse());
      case ServiceResponseCode.badRequest:
        return new HttpResponseBadRequest(response.buildResponse());
      default:
        return new HttpResponseInternalServerError(response.buildResponse());
    }
  }

  @Delete("/negative")
  @ValidateBody(preferenceSchema)
  @JWTRequired()
  async deleteNegativePreference(ctx: Context) {
    const username = ctx.user.username;
    const request = ctx.request.body;

    const response: ServiceResponse = await this.preferenceService.deleteNegativePreference(
      username,
      request
    );
    switch (response.code) {
      case ServiceResponseCode.ok:
        return new HttpResponseOK(response.buildResponse());
      case ServiceResponseCode.preferenceError:
        return new HttpResponseNotFound(response.buildResponse());
      case ServiceResponseCode.badRequest:
        return new HttpResponseBadRequest(response.buildResponse());
      default:
        return new HttpResponseInternalServerError(response.buildResponse());
    }
  }
}
