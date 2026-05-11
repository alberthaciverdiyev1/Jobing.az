import express from 'express';
import hrController from '../Controllers/HrController.js';
import authMiddleware from '../Middlewares/Auth.js';

const router = express.Router();
const hrAuth = [authMiddleware.authenticate, authMiddleware.authorize('company', 'hr', 'admin')];

// ============================================================
// HR PAGES
// ============================================================
router.get('/hr', ...hrAuth, hrController.hrDashboard);
router.get('/hr/dashboard', ...hrAuth, hrController.hrDashboard);
router.get('/hr/jobs', ...hrAuth, hrController.hrJobsView);
router.get('/hr/applications', ...hrAuth, hrController.hrApplicationsView);
router.get('/hr/applications/:id', ...hrAuth, hrController.hrApplicationDetailView);
router.get('/hr/interviews', ...hrAuth, hrController.hrInterviewsView);

// ============================================================
// HR API
// ============================================================
router.get('/api/hr/stats', ...hrAuth, hrController.getStats);
router.get('/api/hr/jobs', ...hrAuth, hrController.getJobs);
router.post('/api/hr/jobs', ...hrAuth, hrController.createJob);
router.put('/api/hr/jobs/:id', ...hrAuth, hrController.updateJob);
router.patch('/api/hr/jobs/:id/toggle', ...hrAuth, hrController.toggleJobActive);
router.get('/api/hr/applications', ...hrAuth, hrController.getApplications);
router.get('/api/hr/applications/:id', ...hrAuth, hrController.getApplication);
router.put('/api/hr/applications/:id/status', ...hrAuth, hrController.updateApplicationStatus);
router.post('/api/hr/applications/:id/interview', ...hrAuth, hrController.scheduleInterview);
router.put('/api/hr/applications/:id/interview/cancel', ...hrAuth, hrController.cancelInterview);
router.get('/api/hr/cvs/:id', ...hrAuth, hrController.getCv);
router.get('/api/hr/companies', ...hrAuth, hrController.getCompanies);
router.get('/api/hr/enums', ...hrAuth, hrController.getEnums);
router.get('/api/hr/application-counts', ...hrAuth, hrController.getApplicationCounts);

export default router;
