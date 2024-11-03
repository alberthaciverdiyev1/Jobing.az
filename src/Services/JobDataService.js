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
            throw new Error('Error inserting records: ' + error.message);
        }
    },

    // Get all job listings
    getAllJobs: async (data) => {
        try {
            const currentDate = new Date();
            const thirtyDaysAgo = new Date(currentDate.setDate(currentDate.getDate() - 30));
            
            const query = {
                $and: [
                    { createdAt: { $gte: thirtyDaysAgo } }
                ]
            };
    
            if (data.cityId) query.$and.push({ cityId: data.cityId });
            if (data.educationId) query.$and.push({ educationId: data.educationId });
            if (data.experience) query.$and.push({ experienceId: +data.experience });
            if (data.jobType) query.$and.push({ jobType: data.jobType });
            if (data.minSalary) query.$and.push({ minSalary: { $gte: +data.minSalary } });
            if (data.maxSalary) query.$and.push({ maxSalary: { $lte: +data.maxSalary } });
            
            if (data.categoryId) {
                query.$and.push({
                    $or: [
                        { categoryId: data.categoryId },
                        { subCategoryId: data.categoryId }
                    ]
                });
            }
            
            if (data.keyword) {
                query.$and.push({
                    $or: [
                        { title: { $regex: data.keyword, $options: 'i' } },
                        { description: { $regex: data.keyword, $options: 'i' } }
                    ]
                });
            }
    
            const limit = 50;
            const offset = data.offset ?? 0;
    
            const totalCount = await JobData.countDocuments(query);
            const jobs = await JobData.find(query)
                .populate({
                    path: 'companyDetails',
                    select: 'imageUrl'
                })
                .sort({ createdAt: -1 }) // Sort by createdAt in descending order
                .skip(offset)
                .limit(limit);
    
            const jobsWithImageUrl = jobs.map(job => ({
                ...job.toObject(),
                companyImageUrl: job.companyDetails?.imageUrl || null
            }));
    
            return {
                totalCount: totalCount,
                jobs: jobsWithImageUrl,
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
