import mongoose from 'mongoose';
import ApplicationService from '../Services/ApplicationService.js';
import Application from '../Entities/Application.js';
import JobData from '../Entities/JobData.js';
import Company from '../../Company/Entities/Company.js';

const ApplicationController = {
    getMyApplications: async (req, res) => {
        try {
            const applications = await ApplicationService.findByUser(req.user._id);
            res.json({ applications });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    create: async (req, res) => {
        try {
            const { jobId, cvId } = req.body;

            // Check if already applied
            const existing = await Application.findOne({
                jobId, userId: req.user._id, deletedAt: null
            });
            if (existing) {
                return res.status(400).json({ error: 'Bu vakansiyaya artıq müraciət etmisiniz' });
            }

            // Get job for company info
            const job = await JobData.findById(jobId).lean();
            if (!job) {
                return res.status(404).json({ error: 'Vakansiya tapılmadı' });
            }

            // Resolve companyId: prefer job's stored companyId, fall back to name lookup
            let companyId = null;
            if (job.companyId) {
                try { companyId = new mongoose.Types.ObjectId(job.companyId); } catch { /* ignore invalid id */ }
            }
            if (!companyId && job.companyName) {
                const company = await Company.findOne({ companyName: job.companyName }).lean();
                companyId = company?._id || null;
            }
            const application = await ApplicationService.create({
                jobId,
                cvId,
                userId: req.user._id,
                companyName: job.companyName || '',
                companyId
            });

            res.status(201).json({ message: 'Müraciətiniz qeydə alındı', application });
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
