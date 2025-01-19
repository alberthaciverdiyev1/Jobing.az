import SiteService from '../Services/SiteService.js';

const SiteController = {
    create: async (req, res) => {
        try {
            const site = await SiteService.create(req.body);
            res.status(201).json(site);
        } catch (error) {
            res.status(500).json({ message: 'Error creating site: ' + error.message });
        }
    },

    getAll: async (req, res) => {
        try {
            const sites = await SiteService.getAll();
            res.status(200).json(sites);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving sites: ' + error.message });
        }
    },

    findById: async (req, res) => {
        try {
            const site = await SiteService.findById(req.params.id);
            if (!site) {
                return res.status(404).json({ message: 'Site not found' });
            }
            res.status(200).json(site);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving site: ' + error.message });
        }
    },

    update: async (req, res) => {
        try {
            const site = await SiteService.update(req.params.id, req.body);
            if (!site) {
                return res.status(404).json({ message: 'Site not found' });
            }
            res.status(200).json(site);
        } catch (error) {
            res.status(500).json({ message: 'Error updating site: ' + error.message });
        }
    },

    delete: async (req, res) => {
        try {
            await SiteService.delete(req.params.id);
            res.status(200).json({ message: 'Site successfully deleted' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting site: ' + error.message });
        }
    }
};

export default SiteController;
