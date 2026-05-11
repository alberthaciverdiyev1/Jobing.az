import Job from '../Models/JobData.js';
import Company from '../Models/Company.js';
import CV from '../Models/CV.js';
import ApplicationService from '../Services/ApplicationService.js';
import Enums from '../Config/Enums.js';

// Reverse enum maps
const _jobTypeMap = {};
Object.entries(Enums.JobTypes).forEach(([key, val]) => {
    _jobTypeMap[val] = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
});
const _educationMap = {};
Object.entries(Enums.Education).forEach(([key, val]) => {
    _educationMap[val] = key.replace(/([A-Z])/g, ' $1').trim();
});
const _experienceMap = {};
Object.entries(Enums.Experience).forEach(([key, val]) => {
    _experienceMap[val] = key;
});

function _resolveJobEnums(job) {
    if (!job) return job;
    if (job.jobType !== undefined && job.jobType !== null) {
        let val = job.jobType;
        if (typeof val === 'string' && /^0x[0-9a-f]+$/i.test(val)) val = parseInt(val, 16);
        else if (typeof val === 'string') val = Number(val);
        job._jobTypeName = _jobTypeMap[val] || 'Unknown';
    }
    if (job.educationId !== undefined && job.educationId !== null) {
        job._educationName = _educationMap[job.educationId] || 'Unknown';
    }
    if (job.experienceId !== undefined && job.experienceId !== null) {
        job._experienceName = _experienceMap[job.experienceId] || 'Unknown';
    }
    return job;
}

const HrController = {

    // ============================================================
    // HELPERS
    // ============================================================

    _getCompanyIds(user) {
        if (user.role === 'company') {
            // Company user: find company by their companyName
            return []; // handled differently below
        }
        // HR user: return assigned companyIds
        return user.companyIds || [];
    },

    _getCompanyFilter(user) {
        if (user.role === 'company') {
            return { companyName: user.companyName };
        }
        if (user.role === 'hr' && user.companyIds && user.companyIds.length > 0) {
            return { companyId: { $in: user.companyIds } };
        }
        return {};
    },

    // ============================================================
    // PAGE RENDERERS
    // ============================================================

    hrDashboard: async (req, res) => {
        const view = { title: 'HR Dashboard', body: 'Dashboard/Index.ejs', js: 'Dashboard.js' };
        res.render('Hr/Main', view);
    },

    hrJobsView: async (req, res) => {
        const view = { title: 'Jobs - HR Panel', body: 'Job/Index.ejs', js: 'Job.js' };
        res.render('Hr/Main', view);
    },

    hrApplicationsView: async (req, res) => {
        const view = { title: 'Applications - HR Panel', body: 'Application/Index.ejs', js: 'Application.js' };
        res.render('Hr/Main', view);
    },

    hrApplicationDetailView: async (req, res) => {
        try {
            const application = await ApplicationService.findById(req.params.id);
            if (!application) return res.redirect('/hr/applications');
            const view = {
                title: 'Application Detail - HR Panel',
                body: 'Application/Detail.ejs',
                js: 'ApplicationDetail.js',
                application
            };
            res.render('Hr/Main', view);
        } catch {
            res.redirect('/hr/applications');
        }
    },

    hrInterviewsView: async (req, res) => {
        const view = { title: 'Interviews - HR Panel', body: 'Interview/Index.ejs', js: 'Interview.js' };
        res.render('Hr/Main', view);
    },

    // ============================================================
    // API - STATS
    // ============================================================

    getStats: async (req, res) => {
        try {
            const user = req.user;
            let totalJobs, activeJobs, totalApplications, interviewCount;
            let companyNames = [];

            if (user.role === 'company') {
                totalJobs = await Job.countDocuments({ companyName: user.companyName });
                activeJobs = await Job.countDocuments({ companyName: user.companyName, isActive: true });
                const company = await Company.findOne({ companyName: user.companyName }).lean();
                const companyId = company?._id;
                const appStats = companyId ? await ApplicationService.countByCompany([companyId]) : { total: 0, pending: 0, accepted: 0, rejected: 0, interview: 0 };
                totalApplications = appStats.total;
                interviewCount = appStats.interview;
                companyNames = company ? [company.companyName] : [];
            } else {
                const companyIds = user.companyIds || [];
                totalJobs = await Job.countDocuments({ companyId: { $in: companyIds } });
                activeJobs = await Job.countDocuments({ companyId: { $in: companyIds }, isActive: true });
                const appStats = await ApplicationService.countByCompany(companyIds);
                totalApplications = appStats.total;
                interviewCount = appStats.interview;
                const companies = await Company.find({ _id: { $in: companyIds } }).select('companyName').lean();
                companyNames = companies.map(c => c.companyName);
            }

            const upcomingInterviews = await ApplicationService.getUpcomingInterviews(
                user.role === 'company'
                    ? [(await Company.findOne({ companyName: user.companyName }).lean())?._id].filter(Boolean)
                    : (user.companyIds || [])
            );

            res.json({
                totalJobs,
                activeJobs,
                pendingApplications: appStats.pending,
                totalApplications,
                interviewCount,
                companyNames,
                upcomingInterviews: upcomingInterviews.length
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // ============================================================
    // API - JOBS
    // ============================================================

    getJobs: async (req, res) => {
        try {
            const { page = 1, limit = 20, search, isActive } = req.query;
            const user = req.user;
            let query = {};

            if (user.role === 'company') {
                query.companyName = user.companyName;
            } else if (user.role === 'hr' && user.companyIds && user.companyIds.length > 0) {
                query.companyId = { $in: user.companyIds.map(id => id.toString()) };
            } else {
                query.companyId = { $in: [] }; // no results
            }

            if (search) query.title = { $regex: search, $options: 'i' };
            if (isActive !== undefined) query.isActive = isActive === 'true';

            const total = await Job.countDocuments(query);
            const jobs = await Job.find(query)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(Number(limit))
                .lean();

            jobs.forEach(job => _resolveJobEnums(job));

            res.json({ jobs, total, page: Number(page), totalPages: Math.ceil(total / limit) });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    createJob: async (req, res) => {
        try {
            const data = req.body;
            data.postedBy = req.user._id;
            data.sourceUrl = data.sourceUrl || 'jobing.az';
            data.uniqueKey = data.uniqueKey || `${data.title}-${data.companyName}-${Date.now()}`;
            data.isActive = true;

            if (req.user.role === 'company') {
                data.companyName = req.user.companyName;
            }

            const job = await Job.create(data);
            res.status(201).json(job);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    updateJob: async (req, res) => {
        try {
            const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!job) return res.status(404).json({ error: 'Job not found' });
            res.json(job);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    toggleJobActive: async (req, res) => {
        try {
            const job = await Job.findById(req.params.id);
            if (!job) return res.status(404).json({ error: 'Job not found' });
            job.isActive = !job.isActive;
            await job.save();
            res.json({ isActive: job.isActive });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // ============================================================
    // API - APPLICATIONS
    // ============================================================

    getApplications: async (req, res) => {
        try {
            const user = req.user;
            let companyIds = [];

            if (user.role === 'company') {
                const company = await Company.findOne({ companyName: user.companyName }).lean();
                if (company) companyIds = [company._id];
            } else {
                companyIds = user.companyIds || [];
            }

            const result = await ApplicationService.findByCompany(companyIds, req.query);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getApplication: async (req, res) => {
        try {
            const application = await ApplicationService.findById(req.params.id);
            if (!application) return res.status(404).json({ error: 'Application not found' });
            res.json(application);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    updateApplicationStatus: async (req, res) => {
        try {
            const { decision, reason } = req.body;
            if (!['accepted', 'rejected'].includes(decision)) {
                return res.status(400).json({ error: 'Decision must be "accepted" or "rejected"' });
            }
            const application = await ApplicationService.updateStatus(req.params.id, decision, reason, req.user._id);
            if (!application) return res.status(404).json({ error: 'Application not found' });
            res.json(application);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    scheduleInterview: async (req, res) => {
        try {
            const { scheduledAt, duration, location, notes } = req.body;
            if (!scheduledAt) return res.status(400).json({ error: 'Interview date/time is required' });

            const application = await ApplicationService.scheduleInterview(req.params.id, {
                scheduledAt: new Date(scheduledAt),
                duration: duration || 30,
                location: location || '',
                notes: notes || ''
            });
            if (!application) return res.status(404).json({ error: 'Application not found' });
            res.json(application);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    cancelInterview: async (req, res) => {
        try {
            const application = await ApplicationService.cancelInterview(req.params.id);
            if (!application) return res.status(404).json({ error: 'Application not found' });
            res.json(application);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // ============================================================
    // API - CV
    // ============================================================

    getCv: async (req, res) => {
        try {
            const cv = await CV.findById(req.params.id)
                .populate('userId', 'name surname email phone')
                .lean();
            if (!cv) return res.status(404).json({ error: 'CV not found' });
            res.json(cv);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // ============================================================
    // API - COMPANIES (for HR job posting form)
    // ============================================================

    getCompanies: async (req, res) => {
        try {
            const user = req.user;
            let companies;

            if (user.role === 'company') {
                companies = await Company.findOne({ companyName: user.companyName }).lean();
                companies = companies ? [companies] : [];
            } else if (user.role === 'hr' && user.companyIds?.length > 0) {
                companies = await Company.find({ _id: { $in: user.companyIds } }).lean();
            } else {
                companies = [];
            }

            res.json(companies);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // ============================================================
    // API - ENUMS
    // ============================================================

    getEnums: async (req, res) => {
        const jobTypes = {};
        Object.entries(Enums.JobTypes).forEach(([key, val]) => {
            jobTypes[val] = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        });
        const education = {};
        Object.entries(Enums.Education).forEach(([key, val]) => {
            education[val] = key.replace(/([A-Z])/g, ' $1').trim();
        });
        const experience = {};
        Object.entries(Enums.Experience).forEach(([key, val]) => {
            experience[val] = key;
        });
        res.json({ jobTypes, education, experience });
    },

    // ============================================================
    // API - APPLICATION COUNTS PER JOB
    // ============================================================

    getApplicationCounts: async (req, res) => {
        try {
            const { jobIds } = req.query;
            if (!jobIds) return res.json({});

            const ids = jobIds.split(',');
            const counts = {};
            await Promise.all(ids.map(async (id) => {
                counts[id] = await ApplicationService.countByJob(id);
            }));
            res.json(counts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

export default HrController;
