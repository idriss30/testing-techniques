const inventory = new Map();
const logger = require("./logger");

const addToInventory = (item, n) => {
  if (typeof n !== "number") {
    logger.logError({ n }, `could not be added because it is not a number`);
    throw new Error("quantity should be a number");
  } else {
    const initialQty = inventory.get(item) || 0;
    const newQty = initialQty + n;
    inventory.set(item, newQty);
    // add memory usage with process.memory

    logger.logInfo(
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
  logger.logInfo({ content }, "inventory items fetched");

  return { ...content, generatedAt: new Date() };
};

module.exports = {
  inventory,
  addToInventory,
  getInventory,
};
