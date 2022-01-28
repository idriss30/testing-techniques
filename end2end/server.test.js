const { afterAll, test, expect, beforeEach } = require("@jest/globals");

const fetch = require("isomorphic-fetch");

const { app, inventory, carts } = require("./server");
const { getInventory } = require("./inventory");

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

const sendGetInventoryRequest = () => {
  return fetch(`${apiRoot}/inventory`, { method: "GET" });
};

describe("addItem", () => {
  beforeEach(() => carts.clear());
  beforeEach(() => inventory.set("cheesecake", 1));

  test("good answer", async () => {
    const addItemResponse = await addItem("idriss", "cheesecake");
    expect(addItemResponse.status).toBe(200);
    expect(await addItemResponse.json()).toEqual(["cheesecake"]);
  });

  test("inventory update", async () => {
    await addItem("jacob", "cheesecake");
    expect(inventory.get("cheesecake")).toBe(0);
  });

  test("cart update", async () => {
    await addItem("idriss", "cheesecake");
    expect(carts.get("idriss")).toEqual(["cheesecake"]);
  });
  test("soldout items", async () => {
    inventory.set("cheesecake", 0);
    const failedAddItem = await addItem("lucas", "cheesecake");
    expect(failedAddItem.status).toBe(404);
  });
});

describe("removeItem", () => {
  test("Remove item from the cart", async () => {
    const initialResponse = await getItems("idriss");
    expect(initialResponse.status).toEqual(404);

    await addItem("idriss", "cheesecake");

    const removeItemResponse = await removeItem("idriss", "cheesecake");
    expect(await removeItemResponse.json()).toEqual([]);

    const finalResponse = await getItems("idriss");
    expect(await finalResponse.json()).toEqual([] || undefined);
  });
});

describe("fetch inventory items", () => {
  test("fetching inventory", async () => {
    inventory.set("cheesecake", 1).set("macarroon", 2);
    const getInventoryResponse = await sendGetInventoryRequest();
    const expected = {
      cheesecake: 1,
      macarroon: 2,
      generatedAt: expect.anything(),
    };

    expect(expected).toEqual(await getInventoryResponse.json());
  });
});

afterAll(() => app.close());
