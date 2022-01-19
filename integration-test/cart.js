const { database } = require("./dbConnection");

// inserting data and testing using test-database

const createCart = (username) => {
  return database("carts").insert({ username });
};

const addItem = (cartId, itemName) => {
  return database("cart_items").insert({ cartId, itemName });
};
module.exports = {
  createCart,
  addItem,
};
