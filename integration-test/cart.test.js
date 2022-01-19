const { expect, test, afterAll, beforeEach } = require("@jest/globals");
const { createCart, addItem } = require("./cart.js");
const { database, closeConnection } = require("./dbConnection");

//test for add items'

beforeEach(async () => {
  await database("carts").truncate(); //delete every row in cart table
  await database("cart_items").truncate();
});

afterAll(async () => await closeConnection());

test("createCart creates a cart for username", async () => {
  await createCart("idriss Ciss");
  const result = await database.select("username").from("carts");
  expect(result).toEqual([{ username: "idriss Ciss" }]);
});

test("the addItem function can add item to the cart", async () => {
  const username = "idriss Ciss";
  await createCart(username);
  const { id: cartId } = await database
    .select()
    .from("carts")
    .where({ username });
  await addItem(cartId, "cheesecake");
  const result = await database.select("itemName").from("cart_items");
  expect(result).toEqual([{ cartId, itemName: "cheesecake" }]);
  // await closeConnection(); // must be called at the end of all test if called this way or use afterAll
});
