import Visitor from '../Models/Visitor.js';
import {Sequelize,Op} from 'sequelize';

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
            console.log({data});
            const newVisitor = new Visitor(data);
            return await newVisitor.save();
        } catch (error) {
            throw new Error('Error creating visitor: ' + error.message);
        }
    },

    updateLastVisit: async (ip, userAgent) => {
        try {
            const visitor = await Visitor.findOne({
                where: { ip }
            });

            if (!visitor) {
                throw new Error('Visitor not found');
            }

            visitor.last_visit = new Date();
            visitor.user_agent = userAgent;

            await visitor.save();

            return visitor;
        } catch (error) {
            throw new Error('Error updating last visit: ' + error.message);
        }
    },


    incrementVisitCount : async (ip) => {
        try {
            const [updatedRowCount, updatedVisitor] = await Visitor.update(
                { visit_count: Sequelize.literal('visit_count + 1') }, // Increment the visit count
                { where: { ip }, returning: true } // Ensure we return the updated data
            );

            if (updatedRowCount === 0) {
                throw new Error('Visitor not found');
            }

            return updatedVisitor[0];
        } catch (error) {
            console.error('Error logging visitor:', error);
            throw new Error('Error logging visitor');
        }
    },

    count: async (day) => {
        try {
            const whereCondition = {};

            if (day) {
                const date = new Date();
                date.setDate(date.getDate() - day);
                whereCondition.created_at = {
                    [Op.gte]: date
                };
            }

            const result = await Visitor.sum('visit_count', {
                where: whereCondition
            });

            return result || 0;
        } catch (error) {
            throw new Error('Error counting visits: ' + error.message);
        }
    },

    dailyCount: async () => {
        try {
            const date = new Date();
            const startOfDay = new Date(date.setHours(0, 0, 0, 0));
            const endOfDay = new Date(startOfDay);
            endOfDay.setHours(23, 59, 59, 999);

            const result = await Visitor.sum('visit_count', {
                where: {
                    created_at: {
                        [Op.between]: [startOfDay, endOfDay]
                    }
                }
            });

            return result || 0;
        } catch (error) {
            throw new Error('Error counting daily visits: ' + error.message);
        }
    }

};

export default VisitorService;
