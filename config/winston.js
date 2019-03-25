const winston = require("winston");

//if we want to have a rolling log file, we can go here
//https://github.com/winstonjs/winston-daily-rotate-file

var loggingLevel = "warn";

if (process && process.env) {
  if (process.env.NODE_ENV == "dev") {
    loggingLevel = "info";
  } else if (process.env.NODE_ENV == "debug") {
    loggingLevel = "verbose";
  }
}

const myFormat = winston.format.printf(function({ level, message, timestamp }) {
  return `${level}: ${message} [${timestamp}]`;
});

winston.configure({
  level: loggingLevel,
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        myFormat,
      ),
    }),
  ],
});

module.exports = winston;
