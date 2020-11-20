import {
  Context,
  Get,
  Post,
  Delete,
  HttpResponseOK,
  HttpResponse,
  ValidateBody,
  Config,
} from "@foal/core";
import { JWTRequired } from "@foal/jwt";
import { PreferenceService, ServiceResponse } from "../../services";

const singlePreference = {
  properites: {
    category: { type: "string" },
    content: { type: "strng" },
  },
  required: ["category", "content"],
  type: "object",
};

const preferenceSchema = {
  type: "array",
  items: singlePreference,
};

export class PreferenceController {
  private preferenceService = new PreferenceService();

  @Get("/positive")
  @ValidateBody(preferenceSchema)
  @JWTRequired()
  async addPositivePreference(ctx: Context) {
    let user = ctx.user;
    console.log(user);
    let request = ctx.request.body;
    let response: ServiceResponse = this.preferenceService.addPositivePreference(
      request
    );
    // switch codici intern i
    // response.buildResponse();
    return new HttpResponseOK("Ancora da completare");
  }

  @Delete("/positive")
  @ValidateBody(preferenceSchema)
  @JWTRequired()
  async deletePositivePreference(ctx: Context) {
    return new HttpResponseOK("Ancora da completare");
  }

  @Post("/negative")
  @ValidateBody(preferenceSchema)
  @JWTRequired()
  async addNegativePreference(ctx: Context) {
    return new HttpResponseOK("Ancora da completare");
  }

  @Delete("/negative")
  @ValidateBody(preferenceSchema)
  @JWTRequired()
  async deleteNegativePreference(ctx: Context) {
    return new HttpResponseOK("Ancora da completare");
  }
}