import VisitorService from "../Services/VisitorService.js";

const visitorLogger = async (req, res, next) => {

    try {
        const ipAddress = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for']?.split(',')[0] || req.ip;
        const userAgent = req.headers['user-agent'];
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

        let visitor = await VisitorService.findByIp(ipAddress);

        if (visitor) {
            if (new Date(visitor.last_visit) <= oneHourAgo) {
                await VisitorService.incrementVisitCount(ipAddress);
                await VisitorService.updateLastVisit(ipAddress, userAgent);
            }
        } else {
            await VisitorService.create({
                ip: ipAddress,
                user_agent: userAgent,
                visit_count: 1,
                last_visit: new Date(),
            });
        }
        next();
    } catch (error) {
        console.error("Error logging visitor:", error);
        next(error);
    }
};

export default visitorLogger;
