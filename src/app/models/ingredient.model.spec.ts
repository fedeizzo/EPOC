import { Config } from "@foal/core";
import { connect, disconnect } from "mongoose";
import { Ingredient, IIngredient } from ".";

describe("The ingredient model", () => {
  let ingredient: IIngredient;

  before(async () => {
    const uri = Config.getOrThrow("mongodb.uri", "string");
    await connect(uri, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
  });

  beforeEach(() => {
    ingredient = new Ingredient();
  });

  after(async () => {
    await new Ingredient().collection.drop();
    await disconnect();
  });

  it("should be able to be inserted in the db", async () => {
    ingredient.name = "Broccoli";
    return ingredient.save();
  });
});
