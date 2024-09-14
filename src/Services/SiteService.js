import Site from '../Models/Site.js';
import {where} from "sequelize";

const SiteService = {
    // Create a new site
    create: async (data) => {
        try {
            const res = await Site.create(data);
            return res;
        } catch (error) {
            throw new Error('Error creating site: ' + error.message);
        }
    },

    // Get all sites
    getAll: async () => {
        try {
            const sites = await Site.findAll();
            return sites;
        } catch (error) {
            throw new Error('Error retrieving sites: ' + error.message);
        }
    },

    // Get a site by ID
    findById: async (id) => {
        try {
            const site = await Site.findByPk(id);
            if (!site) {
                throw new Error('Site not found');
            }
            return site;
        } catch (error) {
            throw new Error('Error retrieving site: ' + error.message);
        }
    },

    // Update a site
    update: async (id, updateData) => {
        try {
            const site = await Site.findByPk(id);
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
    delete: async (id) => {
        try {
            const site = await Site.findByPk(id);
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

export default SiteService;
