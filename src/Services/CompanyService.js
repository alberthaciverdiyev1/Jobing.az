import Company from '../Models/Company.js';

const CompanyService = {
    // Create a company
    create: async (data) => {
        try {
            const res = await Company.create(data);
            return res;
        } catch (error) {
            throw new Error('Error creating company: ' + error.message);
        }
    },

    // Get all companies
    getAll: async () => {
        try {
            const companies = await Company.find({});
            return companies;
        } catch (error) {
            throw new Error('Error retrieving companies: ' + error.message);
        }
    },

    // Find a company by ID
    findById: async (id) => {
        try {
            const company = await Company.findById(id);
            if (!company) {
                throw new Error('Company not found');
            }
            return company;
        } catch (error) {
            throw new Error('Error retrieving company: ' + error.message);
        }
    },

    // Update a company
    update: async (id, updateData) => {
        try {
            const company = await Company.findById(id);
            if (!company) {
                throw new Error('Company not found');
            }
            await company.updateOne(updateData);
            return company;
        } catch (error) {
            throw new Error('Error updating company: ' + error.message);
        }
    },

    // Delete a company
    delete: async (id) => {
        try {
            const company = await Company.findById(id);
            if (!company) {
                throw new Error('Company not found');
            }
            await company.remove();
            return { message: 'Company successfully deleted' };
        } catch (error) {
            throw new Error('Error deleting company: ' + error.message);
        }
    }
};

export default CompanyService;
