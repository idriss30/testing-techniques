const { inventory, addToInventory, getInventory } = require("./inventory");

beforeEach(() => inventory.clear());

test("cancel operation for invalid quantities", () => {
  //expect.hasAssertions(); // cause text to fail if it doesn't execute at least one assertions
  //  expect.assertions(2);

  expect(() => addToInventory("cheesecake", "not a number")).toThrow();
  inventory.set("cheesecake", 0);
  expect(inventory.get("cheesecake")).toBe(0);
  //expect inventory to have only one item
  expect(Array.from(inventory.entries())).toHaveLength(1);
});

test("returned value", () => {
  const result = addToInventory("cheesecake", 2);
  // expect(typeof result).toBe("number"); // number is to big and create a loose assertion
  // better test making the assertion tighter

  //expect(typeof result).toBeGreaterThan(1);
  expect(result).toBe(2);
});

test("inventoryContent", () => {
  inventory
    .set("cheesecake", 1)
    .set("danish", 2)
    .set("croissant", 4)
    .set("banana", 5);

  const inventoryResult = getInventory();
  expect(inventoryResult).toEqual({
    cheesecake: 1,
    danish: 2,
    croissant: 4,
    banana: 5,
    generatedAt: expect.any(Date), // asymmetric matcher to perform verification
  });
});

test("generated at in the past", () => {
  const result = getInventory();
  const currentTime = new Date(Date.now() + 1); // add one milisecond to the current date
  expect(result.generatedAt).toBeBefore(currentTime);
});
