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

    updateLastVisit: async (ip) => {
        try {
            return await Visitor.findOneAndUpdate(
                { ip },
                { lastVisit: Date.now() },
                { new: true }
            );
        } catch (error) {
            throw new Error('Error updating last visit: ' + error.message);
        }
    },

    incrementVisitCount: async (ip) => {
        return VisitorModel.updateOne({ ip }, { $inc: { visitCount: 1 } });
    },

    count: async () => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const result = await Visitor.aggregate([
            {
                $match: {
                    createdAt: { $gte: thirtyDaysAgo }
                }
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
