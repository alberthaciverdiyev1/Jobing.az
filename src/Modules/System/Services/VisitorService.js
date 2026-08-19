import Visitor from '../Entities/Visitor.js';

const VisitorService = {
    findByIp: async (ip) => {
        try {
            return await Visitor.findOne({ ip }).lean();
        } catch (error) {
            throw new Error('Error finding visitor by IP: ' + error.message);
        }
    },

    create: async (data) => {
        try {
            const newVisitor = new Visitor(data);
            return await newVisitor.save();
        } catch (error) {
            throw new Error('Error creating visitor: ' + error.message);
        }
    },

    updateLastVisit: async (ip, userAgent) => {
        try {
            return await Visitor.findOneAndUpdate(
                { ip },
                {
                    lastVisit: Date.now(),
                    userAgent: userAgent
                },
                { new: true }
            );
        } catch (error) {
            throw new Error('Error updating last visit: ' + error.message);
        }
    },


    incrementVisitCount: async (ip) => {
        return Visitor.updateOne({ ip }, { $inc: { visitCount: 1 } });
    },

    count: async (day) => {
        const matchCondition = {};

        if (day) {
            const date = new Date();
            date.setDate(date.getDate() - day);
            matchCondition.createdAt = { $gte: date };
        }

        const result = await Visitor.aggregate([
            {
                $match: matchCondition
            },
            {
                $group: {
                    _id: null,
                    totalVisits: { $sum: "$visitCount" }
                }
            }
        ]);

        return result[0]?.totalVisits || 0;
    },
    dailyCount: async () => {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        const startOfDay = date;

        const result = await Visitor.aggregate([
            { $match: { lastVisit: { $gte: startOfDay } } },
            { $group: { _id: null, totalVisits: { $sum: "$visitCount" } } }
        ]);

        return result[0]?.totalVisits || 0;
    },

    dailyReport: async () => {
        const now = new Date();
        const startOfDay = new Date(now); startOfDay.setHours(0, 0, 0, 0);
        const startOfYesterday = new Date(startOfDay); startOfYesterday.setDate(startOfYesterday.getDate() - 1);
        const startOfWeek = new Date(now); startOfWeek.setDate(startOfWeek.getDate() - 7);

        const [todayStats, yesterdayStats, weeklyStats, topIps, hourlyStats] = await Promise.all([
            // Today: total visits + unique visitors
            Visitor.aggregate([
                { $match: { lastVisit: { $gte: startOfDay } } },
                {
                    $group: {
                        _id: null,
                        totalVisits: { $sum: "$visitCount" },
                        uniqueVisitors: { $sum: 1 }
                    }
                }
            ]),
            // Yesterday
            Visitor.aggregate([
                { $match: { lastVisit: { $gte: startOfYesterday, $lt: startOfDay } } },
                {
                    $group: {
                        _id: null,
                        totalVisits: { $sum: "$visitCount" },
                        uniqueVisitors: { $sum: 1 }
                    }
                }
            ]),
            // Last 7 days total
            Visitor.aggregate([
                { $match: { lastVisit: { $gte: startOfWeek } } },
                { $group: { _id: null, totalVisits: { $sum: "$visitCount" } } }
            ]),
            // Top 10 IPs today
            Visitor.aggregate([
                { $match: { lastVisit: { $gte: startOfDay } } },
                { $sort: { visitCount: -1 } },
                { $limit: 10 },
                { $project: { ip: 1, visitCount: 1, lastVisit: 1, userAgent: 1, _id: 0 } }
            ]),
            // Hourly breakdown today
            Visitor.aggregate([
                { $match: { lastVisit: { $gte: startOfDay } } },
                {
                    $project: {
                        hour: { $hour: "$lastVisit" },
                        visitCount: 1
                    }
                },
                {
                    $group: {
                        _id: "$hour",
                        visits: { $sum: "$visitCount" }
                    }
                },
                { $sort: { _id: 1 } }
            ])
        ]);

        // All-time total
        const allTime = await Visitor.aggregate([
            { $group: { _id: null, totalVisits: { $sum: "$visitCount" }, totalUnique: { $sum: 1 } } }
        ]);

        return {
            today: todayStats[0] || { totalVisits: 0, uniqueVisitors: 0 },
            yesterday: yesterdayStats[0] || { totalVisits: 0, uniqueVisitors: 0 },
            weekly: weeklyStats[0] || { totalVisits: 0 },
            allTime: allTime[0] || { totalVisits: 0, totalUnique: 0 },
            topIps: topIps,
            hourlyStats: hourlyStats
        };
    }

};

export default VisitorService;
