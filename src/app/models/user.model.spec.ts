import { Config } from "@foal/core";
import { connect, disconnect, Schema, FilterQuery } from "mongoose";
import { User } from "../services";

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

  // afterEach(async () => {
  //   await new User().collection.drop();
  // });

  after(async () => {
    await disconnect();
  });

  it("should be able to be insterted in the db", async () => {
    const user = new User();
    const firstName = "Mario";
    const secondName = "Rossi";
    const email = "mario.rossi@rossi.com";
    const username = "MarioRossi";
    const password = "Mario123";
    user.insertUser(firstName, email, username, password, secondName);
  });
});
