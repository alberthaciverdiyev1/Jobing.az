const createLoggerMiddleware = async () => {
    const { default: logger } = await import('../Helpers/Logger.js');

    return (err, req, res, next) => {
        logger.error({
            message: err.message,
            stack: err.stack,
            method: req.method,
            url: req.url,
            ip: req.ip,
        });

        res.status(500).json({error: 'Internal Server Error'});
    };
};


export default createLoggerMiddleware;
