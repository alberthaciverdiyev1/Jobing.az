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
    }
};

export default VisitorService;
