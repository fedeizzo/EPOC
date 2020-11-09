import { Config } from "@foal/core";
import { connect, disconnect, Schema, FilterQuery } from "mongoose";
import { User } from "../models";

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
    await new User().collection.drop();
  });

  after(async () => {
    await disconnect();
  });

  it("should be able to be insterted in the db", async () => {
    const user = new User();
    user.firstName = "Mario";
    user.secondName = "Rossi";
    user.email = "mario.rossi@rossi.com";
    user.username = "MarioRossi";
    await user.setPassword("Mario123");

    return user.save();
  });
});
