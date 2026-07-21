import Enums from '../Config/Enums.js';
import City from '../Models/City.js';
import Cache from '../Helpers/Cache.js';

const CITY_CACHE_TTL = 600; // 10 minutes

const CityService = {
    create: async (data) => {
        try {
            if (!Array.isArray(data)) {
                throw new Error('Data must be an array');
            }
            const results = await City.insertMany(data);

            if (results && Array.isArray(results) && results.length > 0) {
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
            const city = await City.findById(id);
            if (!city) {
                throw new Error('City not found');
            }
            await city.remove();
            return { message: 'City successfully deleted' };
        } catch (error) {
            throw new Error('Error deleting city: ' + error.message);
        }
    },

    findById: async (id) => {
        try {
            const city = await City.findOne({ cityId: id });
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
            const cacheKey = `cities:${data?.site || 'all'}`;
            const cached = Cache.get(cacheKey);
            if (cached) return cached;

            let query = {};
            if (data.site) query.website = Enums.SitesWithId[data.site]
            const cities = await City.find(query).lean();
            Cache.set(cacheKey, cities, CITY_CACHE_TTL);
            return cities;
        } catch (error) {
            throw new Error('Error retrieving cities: ' + error.message);
        }
    },

    update: async (id, updateData) => {
        try {
            const city = await City.findById(id);
            if (!city) {
                throw new Error('City not found');
            }
            await city.updateOne(updateData);
            return city;
        } catch (error) {
            throw new Error('Error updating city: ' + error.message);
        }
    }
};

export default CityService;
