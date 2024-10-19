import JobData from '../Models/JobData.js';

const JobDataService = {
    // Create a new site
    create: async (data) => {
        if (!Array.isArray(data)) {
            throw new Error('Data must be an array');
        }
        const results = await JobData.bulkCreate(data);

        if (results && Array.isArray(results) && results.length > 0) {
            return {
                status: 201,
                message: `Insertion completed. Number of records inserted:${results.length}`,
                count: results.length,
            };
        } else {
            throw new Error('No records were inserted.');
        }
    },

    // Get all jobs
    getAllJobs: async () => {
        try {
            const jobs = await JobData.findAll();
            return jobs;
        } catch (error) {
            throw new Error('Error retrieving jobs: ' + error.message);
        }
    },

    // Get a site by ID
    findSiteById: async (id) => {
        try {
            const site = await JobData.findByPk(id);
            if (!site) {
                throw new Error('Site not found');
            }
            return site;
        } catch (error) {
            throw new Error('Error retrieving site: ' + error.message);
        }
    },

    // Update a site
    updateSite: async (id, updateData) => {
        try {
            const site = await JobData.findByPk(id);
            if (!site) {
                throw new Error('Site not found');
            }
            await site.update(updateData);
            return site;
        } catch (error) {
            throw new Error('Error updating site: ' + error.message);
        }
    },

    // Delete a site
    deleteSite: async (id) => {
        try {
            const site = await JobData.findByPk(id);
            if (!site) {
                throw new Error('Site not found');
            }
            await site.destroy();
            return { message: 'Site successfully deleted' };
        } catch (error) {
            throw new Error('Error deleting site: ' + error.message);
        }
    }
};

export default JobDataService;
