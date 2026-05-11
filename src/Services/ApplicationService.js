import Application from '../Models/Application.js';

const ApplicationService = {

    create: async (data) => {
        return Application.create(data);
    },

    findByJob: async (jobId, query = {}) => {
        const { page = 1, limit = 20, status } = query;
        const filter = { jobId, deletedAt: null };
        if (status) filter.status = status;

        const total = await Application.countDocuments(filter);
        const applications = await Application.find(filter)
            .populate('userId', 'name surname email phone')
            .populate('cvId')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .lean();

        return { applications, total, page: Number(page), totalPages: Math.ceil(total / limit) };
    },

    findByCompany: async (companyIds, query = {}) => {
        const { page = 1, limit = 20, status, jobId } = query;
        const filter = { deletedAt: null };
        if (companyIds.length > 0) {
            filter.companyId = { $in: companyIds };
        }
        if (status) filter.status = status;
        if (jobId) filter.jobId = jobId;

        const total = await Application.countDocuments(filter);
        const applications = await Application.find(filter)
            .populate('userId', 'name surname email phone')
            .populate('cvId')
            .populate('jobId', 'title companyName')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .lean();

        return { applications, total, page: Number(page), totalPages: Math.ceil(total / limit) };
    },

    findByUser: async (userId) => {
        return Application.find({ userId, deletedAt: null })
            .populate('jobId', 'title companyName location minSalary maxSalary')
            .sort({ createdAt: -1 })
            .lean();
    },

    findById: async (id) => {
        return Application.findById(id)
            .populate('userId', 'name surname email phone')
            .populate('cvId')
            .populate('jobId')
            .populate('companyResponse.respondedBy', 'name surname')
            .lean();
    },

    countByJob: async (jobId) => {
        const [total, pending, accepted, rejected, interview] = await Promise.all([
            Application.countDocuments({ jobId, deletedAt: null }),
            Application.countDocuments({ jobId, status: 'pending', deletedAt: null }),
            Application.countDocuments({ jobId, status: 'accepted', deletedAt: null }),
            Application.countDocuments({ jobId, status: 'rejected', deletedAt: null }),
            Application.countDocuments({ jobId, status: 'interview', deletedAt: null })
        ]);
        return { total, pending, accepted, rejected, interview };
    },

    countByCompany: async (companyIds) => {
        const filter = companyIds.length > 0
            ? { companyId: { $in: companyIds }, deletedAt: null }
            : { deletedAt: null };

        const [total, pending, accepted, rejected, interview] = await Promise.all([
            Application.countDocuments(filter),
            Application.countDocuments({ ...filter, status: 'pending' }),
            Application.countDocuments({ ...filter, status: 'accepted' }),
            Application.countDocuments({ ...filter, status: 'rejected' }),
            Application.countDocuments({ ...filter, status: 'interview' })
        ]);
        return { total, pending, accepted, rejected, interview };
    },

    updateStatus: async (id, decision, reason, respondedBy) => {
        const application = await Application.findById(id);
        if (!application) return null;

        application.status = decision;
        application.companyResponse = {
            decision,
            reason: reason || '',
            respondedAt: new Date(),
            respondedBy
        };

        await application.save();
        return application;
    },

    scheduleInterview: async (id, interviewData) => {
        const application = await Application.findById(id);
        if (!application) return null;

        application.status = 'interview';
        application.interview = {
            scheduledAt: interviewData.scheduledAt,
            duration: interviewData.duration || 30,
            location: interviewData.location || '',
            notes: interviewData.notes || '',
            status: 'pending'
        };

        await application.save();
        return application;
    },

    cancelInterview: async (id) => {
        const application = await Application.findById(id);
        if (!application) return null;

        if (application.interview) {
            application.interview.status = 'cancelled';
        }
        await application.save();
        return application;
    },

    userRespond: async (id, userId, message) => {
        const application = await Application.findOne({ _id: id, userId, deletedAt: null });
        if (!application) return null;

        application.userResponse = {
            message: message || '',
            respondedAt: new Date()
        };

        // If interview was pending and user responds, mark as confirmed
        if (application.interview && application.interview.status === 'pending') {
            application.interview.status = 'confirmed';
        }

        await application.save();
        return application;
    },

    getUpcomingInterviews: async (companyIds) => {
        const filter = {
            'interview.scheduledAt': { $ne: null, $gte: new Date() },
            'interview.status': { $in: ['pending', 'confirmed'] },
            deletedAt: null
        };
        if (companyIds.length > 0) {
            filter.companyId = { $in: companyIds };
        }

        return Application.find(filter)
            .populate('userId', 'name surname email phone')
            .populate('jobId', 'title companyName')
            .sort({ 'interview.scheduledAt': 1 })
            .lean();
    }
};

export default ApplicationService;
