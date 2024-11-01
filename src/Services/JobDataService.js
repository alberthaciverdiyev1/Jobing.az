import JobData from '../Models/JobData.js';
import mongoose from 'mongoose';

const JobDataService = {
    // Create new job data (insert multiple records)
    create: async (data) => {
        if (!Array.isArray(data)) {
            throw new Error('Data must be an array');
        }

        try {
            const existingRecords = await JobData.find({
                uniqueKey: { $in: data.map(job => job.uniqueKey) }
            }).select('uniqueKey');

            if (existingRecords.length > 0) {
                const existingUniqueKeys = new Set(existingRecords.map(record => record.uniqueKey));
                let data = data.filter(job => !existingUniqueKeys.has(job.uniqueKey));
            }

            if (data.length > 0) {
                const results = await JobData.insertMany(data);

                return {
                    status: 201,
                    message: `Insertion completed. Number of records inserted: ${results.length}`,
                    count: results.length,
                };
            } else {
                return {
                    status: 200,
                    message: 'No new records to insert. All provided records already exist in the database.',
                     count: 0,
                };
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
            if (data.educationId) query.educationId = data.educationId;
            if (data.experience) query.experienceId = +data.experience;
            if (data.jobType) query.jobType = data.jobType;
            if (data.minSalary) query.minSalary = { $gte: +data.minSalary };
            if (data.maxSalary) query.maxSalary = { $lte: +data.maxSalary };

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

            const limit = 50;
            const offset = data.offset ?? 0;

            const totalCount = await JobData.countDocuments(query);
            const jobs = await JobData.find(query)
                .skip(offset)
                .limit(limit);

            return {
                totalCount: totalCount,
                jobs: jobs,
                hideLoadMore: (limit + offset > totalCount) 
            };
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
