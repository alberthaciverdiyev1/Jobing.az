import City from '../Models/City.js';

const CityService = {
    // Şehir oluştur
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

    // Şehri sil
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

    // ID ile şehri bul
    findById: async (id) => {
        try {
            const city = await City.findById(id);
            if (!city) {
                throw new Error('City not found');
            }
            return city;
        } catch (error) {
            throw new Error('Error retrieving city: ' + error.message);
        }
    },

    // Tüm şehirleri al
    getAll: async () => {
        try {
            return await City.find({});
        } catch (error) {
            throw new Error('Error retrieving cities: ' + error.message);
        }
    },

    // Şehri güncelle
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
