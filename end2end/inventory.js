const inventory = new Map();
const { logInfo, logError } = require("./logger");

const addToInventory = (item, n) => {
  if (typeof n !== "number") {
    logError({ n }, `could not be added because it is not a number`);
    throw new Error("quantity should be a number");
  } else {
    const initialQty = inventory.get(item) || 0;
    const newQty = initialQty + n;
    inventory.set(item, newQty);
    // add memory usage with process.memory

    logInfo(
      { item, n, memoryUsage: process.memoryUsage().rss },
      "item added to the inventory"
    );
    return newQty;
  }
};

const getInventory = () => {
  const invArray = Array.from(inventory.entries());
  const content = invArray.reduce((content, [name, quantity]) => {
    return { ...content, [name]: quantity };
  }, {});
  logInfo({ content }, "inventory items fetched");

  return { ...content, generatedAt: new Date() };
};

module.exports = {
  inventory,
  addToInventory,
  getInventory,
};
