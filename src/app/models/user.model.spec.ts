import { Config } from "@foal/core";
import { strictEqual } from "assert";
import { connect, disconnect, connection } from "mongoose";
import { ServiceResponseCode, UserService } from "../services";
import {
  NegativePreferences,
  PositivePreferences,
  Preferences,
} from "./preferences.model";
import { CostLevels } from "./recipe.model";

describe("The user model", () => {
  before(async () => {
    const uri = Config.getOrThrow("mongodb.uri", "string");
    await connect(uri, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
  });

  afterEach(async () => {
    await connect(Config.getOrThrow("mongodb.uri", "string"), {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
    await connection.db.dropCollection("userclasses");
    await disconnect();
  });

  after(async () => {
    await disconnect();
  });

  it("should be able to be insterted in the db", async () => {
    const user = new UserService();
    const firstName = "Mario";
    const secondName = "Rossi";
    const email = "mario.rossi@rossi.com";
    const username = "MarioRossi";
    const password = "Mario123";
    const prefs = new Preferences();
    prefs.positive = new PositivePreferences();
    prefs.positive.priceRange = CostLevels.high;
    prefs.negative = new NegativePreferences();
    const actualResponse = await user.insertUser(
      firstName,
      email,
      username,
      password,
      prefs,
      secondName
    );

    strictEqual(actualResponse.code, ServiceResponseCode.ok);
  });
});
