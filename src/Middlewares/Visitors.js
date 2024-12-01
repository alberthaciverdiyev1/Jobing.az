import VisitorService from "../Services/VisitorService.js";

const visitorLogger = async (req, res, next) => {
    try {
        const ipAddress = req.ip;
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

        let visitor = await VisitorService.findByIp(ipAddress);

        if (visitor) {
            if (new Date(visitor.lastVisit) <= oneHourAgo) {
                await VisitorService.incrementVisitCount(ipAddress); 
                await VisitorService.updateLastVisit(ipAddress);
            }
        } else {
            await VisitorService.create({
                ip: ipAddress,
                visitCount: 1,
                lastVisit: new Date(),
            });
        }

        next();
    } catch (error) {
        console.error("Error logging visitor:", error);
        next(error);
    }
};

export default visitorLogger;
