import Visitor from '../Models/Visitor.js';

const VisitorService = {
    findByIp: async (ip) => {
        try {
            return await Visitor.findOne({ ip });
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
    }


};

export default VisitorService;
