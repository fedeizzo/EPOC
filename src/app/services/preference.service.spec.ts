import { Config, createService } from "@foal/core";
import { strictEqual } from "assert";
import { PreferenceService, ServiceResponseCode } from ".";
import { connect, disconnect } from "mongoose";
import {
  CostLevels,
  NegativePreferences,
  PositivePreferences,
  PreferencesClass,
  User,
} from "../models";
import { ServiceResponse } from ".";
import { createPreferences, SinglePreference } from "./preference.service";

const mockUsername = "test";

describe("The Preference service", async function () {
  const preferenceService: PreferenceService = createService(PreferenceService);
  const connectionSettings = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  };

  before("Clearing the database, just to be sure", async function () {
    await connect(
      Config.getOrThrow("mongodb.uri", "string"),
      connectionSettings
    );
    try {
      await new User().collection.drop();
    } catch (_) {}
    await disconnect();
  });

  beforeEach("Creating mock user without preferences", async function () {
    await connect(
      Config.getOrThrow("mongodb.uri", "string"),
      connectionSettings
    );
    await createMockUser();
    await User.syncIndexes();
  });

  afterEach(async function () {
    await new User().collection.drop();
    await disconnect();
  });
  /* GET PREFERENCES */
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
        strictEqual(response.prop.positive ? true : false, true);
        strictEqual(response.prop.negative ? true : false, true);
      });
    });
  });
  /* ADD PREFERENCES */
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
        let checkPhrase = "Preference is not in the database";
        if (dbPreference!.recipes.indexOf(recipeName) > -1) {
          checkPhrase = "Preference in the database";
        }
        strictEqual(checkPhrase, "Preference in the database");
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
        let checkPhrase = "Preference is not in the database";
        if (dbPreference!.recipes.indexOf(recipeName) > -1) {
          checkPhrase = "Preference in the database";
        }
        strictEqual(checkPhrase, "Preference in the database");
        strictEqual(ServiceResponseCode.ok, response.code);
      });
    });

    describe("if we want to add a positive preference which has wrong category", async function () {
      it("we should get a badRequest response", async function () {
        const recipeName = "Fasoi bollity";
        let preference: SinglePreference = new SinglePreference();
        preference.category = "plans";
        preference.content = recipeName;
        let response: ServiceResponse = await preferenceService.addPositivePreference(
          mockUsername,
          preference
        );
        strictEqual(response.code, ServiceResponseCode.badRequest);
        strictEqual(
          response.text,
          "You are trying to add to positive preference something which is not in positive preference categories"
        );
      });
    });

    describe("if we want to add a negative preference which has wrong category", async function () {
      it("we should get a badRequest response", async function () {
        const recipeName = "Toast with dinosaur meat";
        let preference: SinglePreference = new SinglePreference();
        preference.category = "Velociraptors";
        preference.content = recipeName;
        let response: ServiceResponse = await preferenceService.addNegativePreference(
          mockUsername,
          preference
        );
        strictEqual(response.code, ServiceResponseCode.badRequest);
        strictEqual(
          response.text,
          "You are trying to add to negative preference something which is not in negative preference categories"
        );
      });
    });
  });
  /* DELETE PREFERENCES */
  describe("When we want to delete a preference", function () {
    describe("if we want to delete a positive preference which exists", async function () {
      const recipeName = "Fasoi e patate";

      beforeEach(async function () {
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

    describe("if we want to delete a positive preference which does not exists", async function () {
      it("we should get a PreferenceError response", async function () {
        let preference: SinglePreference = new SinglePreference();
        preference.category = "recipes";
        preference.content = "Recipe which is not in the user preferences";

        const response: ServiceResponse = await preferenceService.deletePositivePreference(
          mockUsername,
          preference
        );
        strictEqual(response.code, ServiceResponseCode.preferenceError);
        strictEqual(
          response.text,
          "You are trying to remove a positive preference that does not exist"
        );
      });
    });

    describe("if we want to delete a negative preference which exists", async function () {
      const recipeName = "Salsiccia e fagiuoli";

      beforeEach(async function () {
        let preferenceAdded: SinglePreference = new SinglePreference();
        preferenceAdded.category = "recipes";
        preferenceAdded.content = recipeName;
        const responseAdded: ServiceResponse = await preferenceService.addNegativePreference(
          mockUsername,
          preferenceAdded
        );
      });

      it("we should get an ok response with text 'Negative preference removed'", async function () {
        let preference: SinglePreference = new SinglePreference();
        preference.category = "recipes";
        preference.content = recipeName;

        const response: ServiceResponse = await preferenceService.deleteNegativePreference(
          mockUsername,
          preference
        );
        strictEqual(ServiceResponseCode.ok, response.code);
        strictEqual(response.text, "Negative preference removed");
      });
    });

    describe("if we want to delete a negative preference which does not exists", async function () {
      it("we should get a PreferenceError response", async function () {
        let preference: SinglePreference = new SinglePreference();
        preference.category = "recipes";
        preference.content = "Recipe which is not in the user preferences";

        const response: ServiceResponse = await preferenceService.deleteNegativePreference(
          mockUsername,
          preference
        );
        strictEqual(response.code, ServiceResponseCode.preferenceError);
        strictEqual(
          response.text,
          "You are trying to remove a negative preference that does not exist"
        );
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
