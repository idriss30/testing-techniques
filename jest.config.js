// example of global hooks by implemententing database initialisation and tearDoan
module.exports = {
  testEnvironment: "node",
  globalSetup: "./globalSetup.js", // lnk to file for jest to run this function once before all test;
  globalTeardown: "./globalTeardown.js", //link to file for jest to run once after all test
};
