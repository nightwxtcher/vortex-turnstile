import logger from './logger.js';

export function authMiddleware(apiKey) {
    return (req, res, next) => {
        if (!apiKey) {
            return next();
        }

        const providedKey = req.headers['x-api-key'] || req.query.api_key;

        if (!providedKey || providedKey !== apiKey) {
            if (providedKey) {
                logger.warn(`Unauthorized access attempt with invalid API Key from ${req.ip}`);
            }
            return res.status(401).json({
                errorId: 1,
                errorCode: "ERROR_KEY_DOES_NOT_EXIST",
                errorDescription: "The provided API key is invalid or missing. Please use 'x-api-key' header."
            });
        }

        next();
    };
}
