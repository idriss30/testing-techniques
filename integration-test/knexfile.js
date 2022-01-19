module.exports = {
  development: {
    client: "sqlite3",
    connection: { filename: "./integration-test/dev.sqlite" },
    useNullAsDefault: true,
  },
};
