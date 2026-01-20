/*
 * request logger middleware:
 * runs on every HTTP request
 * writes a log to console (pino)
 * also sends the log to the log-service (/api/logs)
 * note: the actual sending happens after the response is finished.
 */

const axios = require('axios');
const pino = require('pino');

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

module.exports = function Logger(req, res, next) {
    const start = Date.now();

    res.on('finish', async () => {
        try {
            const doc = {
                service: process.env.SERVICE_NAME || 'unknown-service',
                method: req.method,
                url: req.originalUrl,
                statusCode: res.statusCode,
                endpoint: req.route?.path ? req.baseUrl + req.route.path : req.path,
                timestamp: new Date(),
                durationMs: Date.now() - start,
                message: `HTTP ${req.method} ${req.originalUrl} finished in ${Date.now() - start}ms`,
                error: res.locals?.error?.message ?? null
            };


            logger.info(doc);


            const baseUrl = process.env.LOG_SERVICE_URL;
            if (baseUrl) {
                await axios.post(`${baseUrl}/api/logs`, doc, { timeout: 1500 });
            }
        } catch (err) {

            logger.error({ err }, 'Failed to send log to log service');
        }
    });

    next();
};

