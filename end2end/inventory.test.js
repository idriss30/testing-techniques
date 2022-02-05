const { inventory, addToInventory, getInventory } = require("./inventory");
const logger = require("./logger");

beforeEach(() => inventory.clear());
beforeAll(() => jest.spyOn(logger, "logInfo").mockImplementation(jest.fn())); // turn spy intp stub by passing dummy function to avoid polluting the console
beforeAll(() => jest.spyOn(logger, "logError").mockImplementation(jest.fn()));
afterEach(() => logger.logInfo.mockClear()); //The spy’s mockClear function will reset both the spy.mock.calls and spy.mock.instances arrays
beforeEach(() =>
  //Before each test, replaces the process’s memoryUsage function with a test double that returns an object containing static values
  jest.spyOn(process, "memoryUsage").mockImplementation(() => {
    return {
      rss: 123456,
      heapTotal: 1,
      heapUsed: 2,
      external: 1,
    };
  })
);

jest.mock("./logger", () => ({
  logInfo: jest.fn(),
  logError: jest.fn(),
}));

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

// implementing a spy to see if logger receives the right parameters

test("login items", () => {
  addToInventory("cheesecake", 2);
  // console.log(logger.logInfo.mock);

  //expect logger to be call once for example
  expect(logger.logInfo.mock.calls).toHaveLength(1);
  //get the object from the mock.calls method

  const loggerArguments = logger.logInfo.mock.calls[0];
  const [firstArg, lastArg] = loggerArguments;

  // asserting on usage of spy only after exercising it

  expect(firstArg).toEqual({ item: "cheesecake", n: 2, memoryUsage: 123456 });
  expect(lastArg).toEqual("item added to the inventory");
});

test("get inventory items", () => {
  inventory.set("croissants", 2);
  getInventory();
  // call logger once
  expect(logger.logInfo.mock.calls).toHaveLength(1);

  const inventoryArgs = logger.logInfo.mock.calls[0];
  const [firstArg, lastArg] = inventoryArgs;

  expect(firstArg).toEqual({ content: { croissants: 2 } });
  expect(lastArg).toEqual("inventory items fetched");
});

// checking if logError is added with add to Inventory
test("logError when adding not a number to inventory", () => {
  inventory.set("cheesecake", "not a number");

  expect(logger.logError.mock.calls).toHaveLength(1);
  const expectedResponse = logger.logError.mock.calls[0];
  const [first, last] = expectedResponse;
  expect(first).toEqual({ n: "not a number" });
  expect(last).toEqual("could not be added because it is not a number");
});
