const inventory = new Map();

const addToInventory = (item, n) => {
  if (typeof n !== "number") {
    throw new Error("quantity should be a number");
  } else {
    const initialQty = inventory.get(item) || 0;
    const newQty = initialQty + n;
    inventory.set(item, newQty);
    return newQty;
  }
};

const getInventory = () => {
  const invArray = Array.from(inventory.entries());
  const content = invArray.reduce((content, [name, quantity]) => {
    return { ...content, [name]: quantity };
  }, {});
  return { ...content, generatedAt: new Date() };
};

module.exports = {
  inventory,
  addToInventory,
  getInventory,
};
