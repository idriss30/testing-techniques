const { afterAll, test, expect, beforeEach } = require("@jest/globals");

const fetch = require("isomorphic-fetch");
const { app, resetState } = require("./server");

//////////   testing without database but state management
const apiRoot = "http://localhost:3000";
const addItem = (username, item) => {
  return fetch(`${apiRoot}/carts/${username}/items/${item}`, {
    method: "POST",
  });
};

const getItems = (username) => {
  return fetch(`${apiRoot}/carts/${username}/items`, { method: "GET" });
};

const removeItem = (username, item) => {
  return fetch(`${apiRoot}/carts/${username}/items/${item}`, {
    method: "DELETE",
  });
};

//putting in a describe
test("adding items to a cart", async () => {
  const initialItemsResponse = await getItems("idriss");
  expect(initialItemsResponse.status).toEqual(404);

  const addItemResponse = await addItem("idriss", "cheesecake");
  expect(await addItemResponse.json()).toEqual(["cheesecake"]);

  const finalItemsResponse = await getItems("idriss");
  expect(await finalItemsResponse.json()).toEqual(["cheesecake"]);
});

test("Remove item from the cart", async () => {
  const initialResponse = await getItems("idriss");
  expect(initialResponse.status).toEqual(404);

  await addItem("idriss", "cheesecake");

  const removeItemResponse = await removeItem("idriss", "cheesecake");
  expect(await removeItemResponse.json()).toEqual([]);

  const finalResponse = await getItems("idriss");
  expect(await finalResponse.json()).toEqual([] || undefined);
});

beforeEach(() => resetState());
afterAll(() => app.close());
