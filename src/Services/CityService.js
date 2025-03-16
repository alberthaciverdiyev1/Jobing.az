import { Op } from 'sequelize';
import Enums from '../Config/Enums.js';
import City from '../Models/City.js';

const CityService = {
    create: async (data) => {
        try {
            if (!Array.isArray(data)) {
                throw new Error('Data must be an array');
            }
            const results = await City.bulkCreate(data); // Use bulkCreate for multiple records

            if (results && results.length > 0) {
                return {
                    status: 201,
                    message: `Insertion completed. Number of records inserted: ${results.length}`,
                    count: results.length,
                };
            } else {
                throw new Error('No records were inserted.');
            }
        } catch (error) {
            throw new Error('Error creating cities: ' + error.message);
        }
    },

    delete: async (id) => {
        try {
            const city = await City.findByPk(id); // Use findByPk to find by primary key
            if (!city) {
                throw new Error('City not found');
            }
            await city.destroy(); // Use destroy method to delete the record
            return { message: 'City successfully deleted' };
        } catch (error) {
            throw new Error('Error deleting city: ' + error.message);
        }
    },

    findById: async (id) => {
        try {
            const city = await City.findOne({ where: { cityId: id } }); // Use findOne with a condition
            if (!city) {
                throw new Error('City not found');
            }
            return city;
        } catch (error) {
            throw new Error('Error retrieving city: ' + error.message);
        }
    },

    getAll: async (data) => {
        try {
            let query = {};
            if (data.site) {
                query.website = Enums.SitesWithId[data.site];
            }
            return await City.findAll({ where: query }); // Use findAll for multiple records
        } catch (error) {
            throw new Error('Error retrieving cities: ' + error.message);
        }
    },

    update: async (id, updateData) => {
        try {
            const city = await City.findByPk(id); // Use findByPk to find the city
            if (!city) {
                throw new Error('City not found');
            }
            await city.update(updateData); // Use update method to modify data
            return city;
        } catch (error) {
            throw new Error('Error updating city: ' + error.message);
        }
    }
};

export default CityService;
    