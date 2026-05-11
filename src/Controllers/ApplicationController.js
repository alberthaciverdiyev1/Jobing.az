import ApplicationService from '../Services/ApplicationService.js';

const ApplicationController = {
    getMyApplications: async (req, res) => {
        try {
            const applications = await ApplicationService.findByUser(req.user._id);
            res.json({ applications });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    userRespond: async (req, res) => {
        try {
            const { message } = req.body;
            const application = await ApplicationService.userRespond(req.params.id, req.user._id, message);
            if (!application) return res.status(404).json({ error: 'Application not found' });
            res.json(application);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

export default ApplicationController;
