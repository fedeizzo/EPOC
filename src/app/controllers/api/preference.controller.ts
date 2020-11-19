import {
  Context,
  Post,
  Delete,
  HttpResponseOK,
  HttpResponse,
  ValidateBody,
} from "@foal/core";
import { PreferenceService, ServiceResponse } from "../../services";

export class PreferenceController {
  private preferenceService = new PreferenceService();

  @Post("/")
  @ValidateBody(preferenceSchema)
  async addPreferences(ctx: Context) {
    let request = ctx.request.body;
    let response: ServiceResponse = this.preferenceService.addPreferences(
      request
    );
    // switch codici interni
    // response.buildResponse();
    return new HttpResponseOK("Ancora da completare");
  }

  @Delete("/")
  @ValidateBody(preferenceSchema)
  async deletePreferences(ctx: Context) {
    return new HttpResponseOK("Ancora da completare");
  }
}

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
