import JobData from '../Models/JobData.js';
import mongoose from 'mongoose';

const JobDataService = {
    // Create new job data (insert multiple records)
    create: async (data) => {
        if (!Array.isArray(data) || data.length === 0) {
            throw new Error('Data must be a non-empty array');
        }

        try {
            const existingRecords = await JobData.find({
                redirectUrl: { $in: data.map(job => job.redirectUrl) }
            }).select('redirectUrl');

            if (existingRecords.length > 0) {
                const existingData = new Set(existingRecords.map(record => record.redirectUrl));
                data = data.filter(job => !existingData.has(job.redirectUrl));
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
            throw new Error(`Error inserting records in JobData: ${error.message}`);
        }
    },

    // Get all job listings
    getAllJobs: async (data) => {
        try {
            const filteredJobs = [];
            const seenUrls = new Set();
            const currentDate = new Date();
            const thirtyDaysAgo = new Date(currentDate.setDate(currentDate.getDate() - 30));

            const query = {
                createdAt: { $gte: thirtyDaysAgo }
            };

            if (data.cityId && !isNaN(Number(data.cityId))) query.cityId = +data.cityId;
            if (data.educationId && !isNaN(Number(data.educationId))) query.educationId = +data.educationId;
            if (data.experience && !isNaN(Number(data.experience))) query.experienceId = +data.experience;
            if (data.jobType) query.jobType = data.jobType;
            if (data.minSalary && !isNaN(Number(data.minSalary))) query.minSalary = { $gte: +data.minSalary };
            if (data.maxSalary && !isNaN(Number(data.maxSalary))) query.maxSalary = { $lte: +data.maxSalary };
            
            if (data.categoryId && !isNaN(Number(data.categoryId))) {
                query.$or = [
                    { categoryId: +data.categoryId },
                    { subCategoryId: +data.categoryId }
                ];
            }            

            if (data.keyword) {
                query.$or = [
                    { title: { $regex: data.keyword, $options: 'i' } },
                    { companyName: { $regex: data.keyword, $options: 'i' } },
                    { location: { $regex: data.keyword, $options: 'i' } }
                ];
            }

            const limit = 50;
            const offset = Number(data.offset) || 0;

            const jobs = await JobData.aggregate([
                { $match: query },
                { $sort: { createdAt: -1 } },
                // {
                //     $group: {
                //         _id: '$redirectUrl', // Group by redirectUrl to remove duplicates
                //         mostRecentJob: { $first: '$$ROOT' } // Get the most recent job for each redirectUrl
                //     }
                // },
                // { $replaceRoot: { newRoot: '$mostRecentJob' } },
                {
                    $lookup: {
                        from: 'companydetails',
                        localField: 'companyDetails',
                        foreignField: '_id',
                        as: 'companyDetails'
                    }
                },
                { $unwind: { path: '$companyDetails', preserveNullAndEmptyArrays: true } },
                { $skip: offset },
                { $limit: limit }
            ]);

            const totalCount = await JobData.countDocuments(query);

            const jobsWithImageUrl = jobs.map(job => ({
                ...job,
                companyImageUrl: job.companyDetails?.imageUrl || null
            }));
            jobsWithImageUrl.forEach(job => {
                if (!seenUrls.has(job.redirectUrl)) {
                    seenUrls.add(job.redirectUrl);
                    filteredJobs.push(job);
                }
            });
            return {
                totalCount: totalCount,
                jobs: filteredJobs,
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
