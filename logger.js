let winstonDailyRotateFile = require('winston-daily-rotate-file');
let winston = require('winston');
let logger = null;
let envConfig = require('dotenv').config().parsed;
let logData = null;

let winstonConfigs = {
    transports: [
        new winstonDailyRotateFile({
          filename: `./logs/{appname}-service-%DATE%.log`,
          datePattern: envConfig.LOG_FREQ,
          zippedArchive: true,
          maxSize: '40m',
          level: 'info',
        }),
        new winstonDailyRotateFile({
            filename: `./logs/{appname}-service-%DATE%.log`,
            datePattern: envConfig.LOG_FREQ,
            zippedArchive: true,
            maxSize: '40m',
            level: 'error',
        }),
        new winstonDailyRotateFile({
            filename: `./logs/{appname}-service-%DATE%.log`,
            datePattern: envConfig.LOG_FREQ,
            zippedArchive: true,
            maxSize: '40m',
            level: 'warn',
        }),
        new winston.transports.Console(),
    ],
    format: winston.format.printf((info) => {
        let message = `[{appname}] - ${new Date(Date.now()).toUTCString()} | ${info.level.toUpperCase()} | ${
          '{appname}-service'
        }.log | ${info.message} | `;
        message = info.obj
          ? message + `data:${JSON.stringify(info.obj)} | `
          : message;
        message = logData
          ? message + `log_data:${JSON.stringify(logData)} | `
          : message;
        return message;
    })
}

let getLogger = () => {
    if(!logger) {
       logger = winston.createLogger(winstonConfigs);
    }
    return logger;
};

let info = async(message, ...obj) => {
    getLogger().log('info', message, { obj });
};

let error = async(message, ...obj) => {
    getLogger().log('error', message, { obj });
};

let warn = async(message, ...obj) => {
    getLogger().log('warn', message, { obj });
};

exports.info = info;
exports.error = error;
exports.warn = warn;
