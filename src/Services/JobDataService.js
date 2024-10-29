import JobData from '../Models/JobData.js';
import mongoose from 'mongoose';

const JobDataService = {
    // Create new job data (insert multiple records)
    create: async (data) => {
        if (!Array.isArray(data)) {
            throw new Error('Data must be an array');
        }

        try {
            // Use insertMany for bulk insertion in MongoDB
            const results = await JobData.insertMany(data);

            if (results && results.length > 0) {
                return {
                    status: 201,
                    message: `Insertion completed. Number of records inserted: ${results.length}`,
                    count: results.length,
                };
            } else {
                throw new Error('No records were inserted.');
            }
        } catch (error) {
            throw new Error('Error inserting records: ' + error.message);
        }
    },

    // Get all job listings
    getAllJobs: async (data) => {
        try {
            let query = {};
            if (data.cityId) query.cityId = data.cityId;
            if (data.experience) query.experience = data.experience;
            if (data.jobType) query.jobType = data.jobType;
            if (data.minSalary || data.maxSalary) {
                query.salary = {};
                if (data.minSalary) query.salary.$gte = data.minSalary;
                if (data.maxSalary) query.salary.$lte = data.maxSalary;
            }
            if (data.categoryId) {
                query.$or = [
                    { categoryId: data.categoryId },
                    { subCategoryId: data.categoryId }
                ];
            }
            if (data.keyword) {
                query.$or = query.$or || [];
                query.$or.push(
                    { title: { $regex: data.keyword, $options: 'i' } },
                    { description: { $regex: data.keyword, $options: 'i' } }
                );
            }

            const jobs = await JobData.find(query);
            return jobs;
        } catch (error) {
            throw new Error('Error retrieving jobs: ' + error.message);
        }
    },

    // Find a job by ID
    findSiteById: async (id) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error('Invalid job ID format');
            }

            // findById() retrieves a document by its ID
            const job = await JobData.findById(id);
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
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error('Invalid job ID format');
            }

            // findByIdAndUpdate() updates and returns the updated document
            const job = await JobData.findByIdAndUpdate(id, updateData, { new: true });
            if (!job) {
                throw new Error('Job not found');
            }
            return job;
        } catch (error) {
            throw new Error('Error updating job: ' + error.message);
        }
    },

    // Delete job data
    deleteSite: async (id) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error('Invalid job ID format');
            }

            // findByIdAndDelete() deletes a document by its ID
            const job = await JobData.findByIdAndDelete(id);
            if (!job) {
                throw new Error('Job not found');
            }
            return { message: 'Job successfully deleted' };
        } catch (error) {
            throw new Error('Error deleting job: ' + error.message);
        }
    }
};

export default JobDataService;
