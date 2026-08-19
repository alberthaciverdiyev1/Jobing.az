import VisitorService from "../Modules/System/Services/VisitorService.js";

const visitorLogger = async (req, res, next) => {
    // Fire-and-forget: don't block page rendering on visitor tracking
    next();

    try {
        const ipAddress = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for']?.split(',')[0] || req.ip;
        const userAgent = req.headers['user-agent'];
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

        let visitor = await VisitorService.findByIp(ipAddress);

        if (visitor) {
            if (new Date(visitor.lastVisit) <= oneHourAgo) {
                await Promise.all([
                    VisitorService.incrementVisitCount(ipAddress),
                    VisitorService.updateLastVisit(ipAddress, userAgent)
                ]);
            }
        } else {
            await VisitorService.create({
                ip: ipAddress,
                userAgent: userAgent,
                visitCount: 1,
                lastVisit: new Date(),
            });
        }
    } catch (error) {
        console.error("Error logging visitor:", error.message);
    }
};

export default visitorLogger;
