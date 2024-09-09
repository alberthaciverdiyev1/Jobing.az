import SiteService from '../Services/siteService.js';

const siteController = {
    createSite: async (req, res) => {
        try {
            const site = await SiteService.createSite(req.body);
            res.status(201).json(site);
        } catch (error) {
            res.status(500).json({ message: 'Error creating site: ' + error.message });
        }
    },

    getSites: async (req, res) => {
        try {
            const sites = await SiteService.getAllSites();
            res.status(200).json(sites);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving sites: ' + error.message });
        }
    },

    getSiteById: async (req, res) => {
        try {
            const site = await SiteService.findSiteById(req.params.id);
            if (!site) {
                return res.status(404).json({ message: 'Site not found' });
            }
            res.status(200).json(site);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving site: ' + error.message });
        }
    },

    updateSite: async (req, res) => {
        try {
            const site = await SiteService.updateSite(req.params.id, req.body);
            if (!site) {
                return res.status(404).json({ message: 'Site not found' });
            }
            res.status(200).json(site);
        } catch (error) {
            res.status(500).json({ message: 'Error updating site: ' + error.message });
        }
    },

    deleteSite: async (req, res) => {
        try {
            await SiteService.deleteSite(req.params.id);
            res.status(200).json({ message: 'Site successfully deleted' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting site: ' + error.message });
        }
    }
};

export default siteController;
