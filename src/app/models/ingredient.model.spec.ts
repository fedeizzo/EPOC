import { Config } from "@foal/core";
import { connect, disconnect } from "mongoose";
import { Ingredient } from ".";

describe("The ingredient model", () => {
  before(async () => {
    const uri = Config.getOrThrow("mongodb.uri", "string");
    await connect(uri, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
  });

  after(async () => {
    await new Ingredient().collection.drop();
    await disconnect();
  });

  it("should be able to be inserted in the db", async () => {
    const ingredient = new Ingredient();
    ingredient.name = "Broccoli";
    return ingredient.save();
  });
});
