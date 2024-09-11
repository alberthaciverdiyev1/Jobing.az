import JobData from '../Models/JobData.js';

const JobDataService = {
    // Create a new site
    createSite: async (data) => {
        try {
            const res = await JobData.create(data);
            return res;
        } catch (error) {
            throw new Error('Error creating site: ' + error.message);
        }
    },

    // Get all sites
    getAllSites: async () => {
        try {
            const sites = await JobData.findAll();
            return sites;
        } catch (error) {
            throw new Error('Error retrieving sites: ' + error.message);
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
