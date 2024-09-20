import City from '../Models/City.js';

const CityService = {
    create: async (data) => {
        try {
            if (!Array.isArray(data)) {
                throw new Error('Data must be an array');
            }
            const results = await City.bulkCreate(data);

            if (results && Array.isArray(results) && results.length > 0) {
                return {
                    status: 201,
                    message: `Insertion completed. Number of records inserted:${results.length}`,
                    count: results.length,
                };
            } else {
                throw new Error('No records were inserted.');
            }
        } catch (error) {
            throw new Error('Error creating categories: ' + error.message);
        }
    },

    // Get all
    delete: async (id) => {
        try {
            const category = await City.findByPk(id);
            if (!category) {
                throw new Error('City not found');
            }
            await category.destroy();
            return {message: 'City successfully deleted'};
        } catch (error) {
            throw new Error('Error deleting category: ' + error.message);
        }
    },

    // Get a category by ID
    findById: async (id) => {
        try {
            const category = await City.findByPk(id);
            if (!category) {
                throw new Error('City not found');
            }
            return category;
        } catch (error) {
            throw new Error('Error retrieving category: ' + error.message);
        }
    },

    // Update a category
    getAll: async () => {
        try {
            return await City.findAll();
        } catch (error) {
            throw new Error('Error retrieving categories: ' + error.message);
        }
    },

    // Delete a category
    update: async (id, updateData) => {
        try {
            const category = await City.findByPk(id);
            if (!category) {
                throw new Error('City not found');
            }
            await category.update(updateData);
            return category;
        } catch (error) {
            throw new Error('Error updating category: ' + error.message);
        }
    }
};

export default CityService;
