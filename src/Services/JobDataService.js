import JobData from '../Models/JobData.js';

const JobDataService = {
    // Create new job data
    create: async (data) => {
        if (!Array.isArray(data)) {
            throw new Error('Data must be an array');
        }
        const results = await JobData.bulkCreate(data);

        if (results && Array.isArray(results) && results.length > 0) {
            return {
                status: 201,
                message: `Insertion completed. Number of records inserted: ${results.length}`,
                count: results.length,
            };
        } else {
            throw new Error('No records were inserted.');
        }
    },

    // Get all job listings
    getAllJobs: async () => {
        try {
            const jobs = await JobData.findAll();
            return jobs;
        } catch (error) {
            throw new Error('Error retrieving jobs: ' + error.message);
        }
    },

    // Find a job by ID
    findSiteById: async (id) => {
        try {
            const job = await JobData.findByPk(id);
            if (!job) {
                throw new Error('Job not found');
            }
            return job;
        } catch (error) {
            throw new Error('Error retrieving job: ' + error.message);
        }
    },

    // Update job data
    updateSite: async (id, updateData) => {
        try {
            const job = await JobData.findByPk(id);
            if (!job) {
                throw new Error('Job not found');
            }
            await job.update(updateData);
            return job;
        } catch (error) {
            throw new Error('Error updating job: ' + error.message);
        }
    },

    // Delete job data
    deleteSite: async (id) => {
        try {
            const job = await JobData.findByPk(id);
            if (!job) {
                throw new Error('Job not found');
            }
            await job.destroy();
            return { message: 'Job successfully deleted' };
        } catch (error) {
            throw new Error('Error deleting job: ' + error.message);
        }
    }
};

export default JobDataService;
