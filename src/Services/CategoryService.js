import Category from '../Models/Category.js';
import Enums from '../Config/Enums.js';

const CategoryService = {
    addForeignCategories: async (data) => {
        try {
            if (!Array.isArray(data)) {
                throw new Error('Data must be an array');
            }

            const results = await Category.bulkCreate(data);

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
            throw new Error('Error creating categories: ' + error.message);
        }
    },

    getForeignCategories: async () => {
        try {
            return await Category.findAll();
        } catch (error) {
            throw new Error('Error retrieving categories: ' + error.message);
        }
    },

    countCategory: async () => {
        try {
            return await Category.count();
        } catch (error) {
            throw new Error('Error retrieving categories: ' + error.message);
        }
    },

    getLocalCategories: async (data) => {
        try {
            let categories = await Category.findAll({
                // where: { id: 36 },
                attributes: { exclude: ['id'] }
            });

            return categories.map(category => category.dataValues);

        } catch (error) {
            throw new Error('Error retrieving categories: ' + error.message);
        }
    },

    addLocalCategory: async (data) => {
        try {
            const result = await Category.create(data);
            return {
                status: 201,
                message: `Success`,
                category: result,
            };
        } catch (error) {
            throw new Error('Error creating category: ' + error.message);
        }
    },

    // Delete category
    delete: async (id) => {
        try {
            const category = await Category.findByPk(id);
            if (!category) {
                throw new Error('Category not found');
            }
            await category.destroy();
            return { message: 'Category successfully deleted' };
        } catch (error) {
            throw new Error('Error deleting category: ' + error.message);
        }
    },

    findById: async (id) => {
        try {
            const category = await Category.findByPk(id);
            if (!category) {
                throw new Error('Category not found');
            }
            return category;
        } catch (error) {
            throw new Error('Error retrieving category: ' + error.message);
        }
    },

    // Update category
    update: async (id, updateData) => {
        try {
            const category = await Category.findByPk(id);
            if (!category) {
                throw new Error('Category not found');
            }
            await category.update(updateData);
            return category;
        } catch (error) {
            throw new Error('Error updating category: ' + error.message);
        }
    }
};

export default CategoryService;
