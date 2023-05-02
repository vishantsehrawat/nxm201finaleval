const winston = require('winston');
require('winston-mongodb');
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
        new winston.transports.MongoDB({
            db: "mongodb+srv://vishants:vishants@cluster0.qpi9ba6.mongodb.net/nxm201eval?retryWrites=true&w=majority",
            level: "info",
        })
    ],
  });
