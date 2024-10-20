const createLoggerMiddleware = () => {
    return (err, req, res, next) => {
        if (!logger) {
            console.error('Logger is not configured');
            return res.status(500).json({ error: 'Logger is not configured' });
        }
        
        logger.error({
            message: err.message,
            stack: err.stack,
            method: req.method,
            url: req.url,
            ip: req.ip,
        });

        res.status(500).json({ error: 'Internal Server Error' });
    };
};

export default createLoggerMiddleware;
