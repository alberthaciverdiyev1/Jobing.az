import Company from '../Models/Company.js';

const CompanyService = {
    // Create a company
    create: async (data) => {
        try {
            if (!Array.isArray(data)) {
                throw new Error('Data must be an array');
            }

            const existingRecords = await Company.find({
                uniqueKey: { $in: data.map(c => c.uniqueKey) }
            }).select('uniqueKey');

            if (existingRecords.length > 0) {
                const existingUniqueKeys = new Set(existingRecords.map(record => record.uniqueKey));
                data = data.filter(c => !existingUniqueKeys.has(c.uniqueKey));
            }


            if (data.length > 0) {
                const results = await Company.insertMany(data);
                return {
                    status: 201,
                    message: `Insertion completed. Number of records inserted: ${results.length}`,
                    count: results.length,
                };
            } else {
                return {
                    status: 200,
                    message: 'No new records to insert. All provided records already exist in the database.',
                    count: 0,
                };
            }
        } catch (error) {
            throw new Error('Error creating companies: ' + error.message);
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
