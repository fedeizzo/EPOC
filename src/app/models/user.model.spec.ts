import { Config } from "@foal/core";
import { strictEqual } from "assert";
import { assert } from "console";
import { connect, disconnect, Schema, FilterQuery, connection } from "mongoose";
import { ServiceResponseCode, UserService } from "../services";

type ObjectId = Schema.Types.ObjectId;

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
    await connect(Config.getOrThrow('mongodb.uri', 'string'), { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
    await connection.db.dropCollection('userclasses');
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
    const actualResponse = await user.insertUser(firstName, email, username, password, secondName);

    strictEqual(actualResponse.code, ServiceResponseCode.ok);
  });
});
