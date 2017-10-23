import winston from 'winston';

const level = process.env.LOG_LEVEL || 'debug';

const logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      level,
      prettyPrint: true,
      colorize: true,
      silent: false,
      timestamp: false
    })
  ]
});

export default logger;
