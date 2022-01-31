const pino = require("pino");

const pinoInstance = pino();

const logger = {
  logInfo: pinoInstance.info.bind(pinoInstance),
  logError: pinoInstance.info.bind(pinoInstance),
};

module.exports = logger;
