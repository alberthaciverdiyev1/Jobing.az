import Company from '../Models/Company.js';
import JobData from "../Models/JobData.js";

const CompanyService = {
    // Create a company
    create: async (data) => {
        try {
            if (!Array.isArray(data)) {
                throw new Error('Data must be an array');
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

    count: async () => {
        return Company.countDocuments();
    },
    // Get all companies
    getAll: async () => {
        try {
            return await Company.find({});
        } catch (error) {
            throw new Error('Error retrieving companies: ' + error.message);
        }
    },

    updateCompanyImageUrl: async (companyId, newImagePath) => {
        try {
            await Company.findByIdAndUpdate(companyId, { imageUrl: newImagePath });
        } catch (error) {
            throw new Error(`Error updating image URL for company with ID ${companyId}: ${error.message}`);
        }
    },

    removeDuplicates: async () => {
        try {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const companiesList = await Company.find({
                createdAt: { $gte: thirtyDaysAgo },
            }).sort({ createdAt: -1 });

            if (!companiesList || companiesList.length === 0) {
                return {
                    status: 200,
                    message: 'No data found for the last 30 days.',
                    count: 0,
                };
            }

            const seenUniqueKeys = new Map();
            const duplicateIds = [];

            companiesList.forEach(c => {
                const uniqueKey = c.uniqueKey;
                if (seenUniqueKeys.has(uniqueKey)) {
                    const previousCompany = seenUniqueKeys.get(uniqueKey);
                    duplicateIds.push(previousCompany._id);
                    seenUniqueKeys.set(uniqueKey, c);
                } else {
                    seenUniqueKeys.set(uniqueKey, c);
                }
            });

            if (duplicateIds.length > 0) {
             await Company.deleteMany({ _id: { $in: duplicateIds } });
                return {
                    status: 201,
                    message: `Deleted ${duplicateIds.length} duplicate records from the last 30 days.`,
                    count: duplicateIds.length,
                };
            } else {
                return {
                    status: 200,
                    message: 'No duplicate data found for the last 30 days.',
                    count: 0,
                };
            }
        } catch (error) {
            return {
                status: 500,
                message: 'An error occurred during the process.',
                error: error.message,
            };
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
            return {message: 'Company successfully deleted'};
        } catch (error) {
            throw new Error('Error deleting company: ' + error.message);
        }
    }
};

export default CompanyService;
