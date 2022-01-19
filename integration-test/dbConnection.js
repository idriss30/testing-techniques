const database = require("knex")(require("./knexfile").development); // set a connection pool for the development database

const closeConnection = () => database.destroy(); // delete

module.exports = {
  database,
  closeConnection,
};
