exports.up = async (knex) => {
  // migrates database to the next state
  await knex.schema.createTable("carts", (table) => {
    table.increments("id");
    table.string("username");
  });

  await knex.schema.createTable("cart_items", (table) => {
    table.integer("cartId").references("carts.id"); // create a column that references the cart id in the cart tABLE
    table.string("itemName");
  });
};

exports.down = async (knex) => {
  // migrate to previous state by deleting the carts and cart_items tables
  await knex.schema.dropTable("carts");
  await knex.schema.dropTable("cart_items");
};
