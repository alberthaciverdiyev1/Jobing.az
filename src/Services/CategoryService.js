import ForeignCategory from '../Models/ForeignCategory.js';
import Category from '../Models/Category.js';

const CategoryService = {
    // Foreign Categories add
    addForeignCategories: async (data) => {
        try {
            if (!Array.isArray(data)) {
                throw new Error('Data must be an array');
            }

            const results = await ForeignCategory.insertMany(data);

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
            throw new Error('Error creating categories: ' + error.message);
        }
    },

    // get all foreign categories
    getForeignCategories: async () => {
        try {
            return await ForeignCategory.find({});
        } catch (error) {
            throw new Error('Error retrieving categories: ' + error.message);
        }
    },

    getLocalCategories: async () => {
        try {
            return await Category.find({});
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
            const category = await Category.findById(id);
            if (!category) {
                throw new Error('Category not found');
            }
            await category.remove();
            return { message: 'Category successfully deleted' };
        } catch (error) {
            throw new Error('Error deleting category: ' + error.message);
        }
    },

    // Fing with id
    findById: async (id) => {
        try {
            const category = await Category.findById(id);
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
            const category = await Category.findById(id);
            if (!category) {
                throw new Error('Category not found');
            }
            await category.updateOne(updateData);
            return category;
        } catch (error) {
            throw new Error('Error updating category: ' + error.message);
        }
    }
};

export default CategoryService;
