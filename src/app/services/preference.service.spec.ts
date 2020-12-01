import { Config, createService } from "@foal/core";
import { equal, strictEqual } from "assert";
import { PreferenceService, ServiceResponseCode } from ".";
import { connection, connect, disconnect } from "mongoose";
import { DocumentType, pre } from "@typegoose/typegoose";
import {
  CostLevels,
  NegativePreferences,
  PositivePreferences,
  Preferences,
  PreferencesClass,
  User,
} from "../models";
import { UserClass } from "../models/user.model";
import { ServiceResponse } from ".";
import { createPreferences, SinglePreference } from "./preference.service";
import { assert } from "console";
import { mock } from "ts-mockito";
import { assertionIsClass } from "@typegoose/typegoose/lib/internal/utils";

const mockUsername = "test";

describe("The preference service", async function () {
  const preferenceService: PreferenceService = createService(PreferenceService);
  const connectionSettings = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  };

  beforeEach("Creating mock user without preferences", async function () {
    await connect(
      Config.getOrThrow("mongodb.uri", "string"),
      connectionSettings
    );
    await createMockUser();
    await User.syncIndexes();
    await Preferences.syncIndexes();
    await PositivePreferences.syncIndexes();
    await NegativePreferences.syncIndexes();
  });

  afterEach(async function () {
    await new User().collection.drop();
    await disconnect();
  });

  describe("When we want to get all the preferences", function () {
    describe("if the user does not have any preference associated", function () {
      it("should return a ok response", async function () {
        const response: ServiceResponse = await preferenceService.getAllPreference(
          mockUsername
        );
        strictEqual(response.code, ServiceResponseCode.ok);
      });
    });

    describe("if the user has preferences associated", function () {
      beforeEach("", function (done) {
        let preference: SinglePreference = new SinglePreference();
        preference.category = "recipes";
        preference.content = "Fasoi bolliti";
        // await preferenceService.addPositivePreference(mockUsername, preference);
        preferenceService
          .addPositivePreference(mockUsername, preference)
          .then(() => {
            done();
          })
          .catch((err) => {
            console.log(err);
          });
      });

      it("should return ok response with an instance of preference in the response.prop attribute", async function () {
        const response: ServiceResponse = await preferenceService.getAllPreference(
          mockUsername
        );
        strictEqual(response.code, ServiceResponseCode.ok);
        strictEqual(typeof response.prop, typeof new PreferencesClass());
      });
    });
  });

  describe("When we want to add a preference to some user", async function () {
    describe("if we want to add a positive preference", async function () {
      it("we should get an ok response and in the preferences we should find the recipe we added", async function () {
        const recipeName = "Fasoi bollity";
        let preference: SinglePreference = new SinglePreference();
        preference.category = "recipes";
        preference.content = recipeName;
        let response: ServiceResponse = await preferenceService.addPositivePreference(
          mockUsername,
          preference
        );

        const dbPreference = (await User.findOne({ username: mockUsername }))
          ?.preferences.positive;
        strictEqual(dbPreference?.recipes[0], recipeName);
        strictEqual(ServiceResponseCode.ok, response.code);
      });
    });
    describe("if we want to add a negative preference", async function () {
      it("we should get an ok response and in the negative preferences we should find the recipe we added", async function () {
        const recipeName = "Fasoi Stracotti";
        let preference: SinglePreference = new SinglePreference();
        preference.category = "recipes";
        preference.content = recipeName;
        let response: ServiceResponse = await preferenceService.addNegativePreference(
          mockUsername,
          preference
        );

        const dbPreference = (await User.findOne({ username: mockUsername }))
          ?.preferences.negative;
        strictEqual(dbPreference?.recipes[0], recipeName);
        strictEqual(ServiceResponseCode.ok, response.code);
      });
    });
  });

  describe("When we want to delete a preference", function () {
    describe("if we want to delete a positive preference which exists", async function () {
      const recipeName = "Fasoi e patate";

      beforeEach(async function(){
        let preferenceAdded: SinglePreference = new SinglePreference();
        preferenceAdded.category = "recipes";
        preferenceAdded.content = recipeName;
        const responseAdded: ServiceResponse = await preferenceService.addPositivePreference(
          mockUsername,
          preferenceAdded
        );
      });

      it("we should get an ok response with text 'Positive preference removed'", async function () {
        let preference: SinglePreference = new SinglePreference();
        preference.category = "recipes";
        preference.content = recipeName;

        const response: ServiceResponse = await preferenceService.deletePositivePreference(
          mockUsername,
          preference
        );
        strictEqual(ServiceResponseCode.ok, response.code);
        strictEqual(response.text, "Positive preference removed");
      });
    });
  });
});

async function createMockUser() {
  let mockUser = new User();
  mockUser.firstName = "test";
  mockUser.secondName = "test";
  mockUser.email = "test";
  mockUser.username = mockUsername;
  mockUser.password = "maledetticontrollisullepassword";
  await createPreferences(mockUser);

  try {
    await mockUser.save();
  } catch (error) {
    console.log("Errore inserimento utente:");
    console.error(error.message);
  }
}
