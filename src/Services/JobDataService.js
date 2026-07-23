import JobData from '../Models/JobData.js';
import mongoose from 'mongoose';
import Company from '../Models/Company.js';
import Cache from '../Helpers/Cache.js';

function generateSlug(title, suffix) {
    const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 80);
    const shortSuffix = suffix ? String(suffix).slice(-6) : Date.now().toString().slice(-6);
    return `${slug}-${shortSuffix}`;
}

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
    removeDuplicates: async () => {
        try {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const allJobs = await JobData.find({
                createdAt: { $gte: thirtyDaysAgo },
            }).sort({ createdAt: -1 });

            if (!allJobs || allJobs.length === 0) {
                return {
                    status: 200,
                    message: 'No data found for the last 30 days.',
                    count: 0,
                };
            }

            const seenUniqueKeys = new Map();
            const duplicateIds = [];

            allJobs.forEach(job => {
                const uniqueKey = job.uniqueKey;
                if (seenUniqueKeys.has(uniqueKey)) {
                    const previousJob = seenUniqueKeys.get(uniqueKey);
                    duplicateIds.push(previousJob._id);
                    seenUniqueKeys.set(uniqueKey, job);
                } else {
                    seenUniqueKeys.set(uniqueKey, job);
                }
            });

            if (duplicateIds.length > 0) {
                await JobData.deleteMany({ _id: { $in: duplicateIds } });
                return {
                    status: 201,
                    message: `Deleted ${duplicateIds.length} duplicate records from the last 30 days.`,
                    count: duplicateIds.length,
                };
            } else {
                return {
                    status: 200,
                    message: 'No duplicate data found for the last 30 days.',
                    count: 0,
                };
            }
        } catch (error) {
            return {
                status: 500,
                message: 'An error occurred during the process.',
                error: error.message,
            };
        }
    },

    getAllJobs: async (data) => {
        try {
            const currentDate = new Date();
            const thirtyDaysAgo = new Date(currentDate.setDate(currentDate.getDate() - 30));

            const query = {
                createdAt: { $gte: thirtyDaysAgo },
                isActive: true
            };

            if (data.categoryId && !isNaN(Number(data.categoryId))) query.categoryId = +data.categoryId;
            if (data.cityId && !isNaN(Number(data.cityId))) query.cityId = +data.cityId;
            if (data.educationId && !isNaN(Number(data.educationId))) query.educationId = +data.educationId;
            if (data.experience && !isNaN(Number(data.experience))) query.experienceId = +data.experience;
            if (data.jobType) query.jobType = data.jobType;
            if (!data.allJobs) query.sourceUrl = 'jobing.az';
            if (data.minSalary && !isNaN(Number(data.minSalary)) && data.minSalary !== 0) query.minSalary = { $gte: +data.minSalary };
            if (data.maxSalary && !isNaN(Number(data.maxSalary))) query.maxSalary = { $lte: +data.maxSalary };

            // Use $text index for keyword search (indexed, much faster than $regex)
            // Prefix each word with + to require ALL words (matching original $and behavior)
            if (data.keyword && data.keyword.trim()) {
                const terms = data.keyword.trim().split(/\s+/).filter(Boolean);
                query.$text = { $search: terms.map(w => `+${w}`).join(' ') };
            }

            const limit = 100;
            const offset = Math.min(Number(data.offset) || 0, 10000); // cap offset to prevent deep scans

            // Run find and count in parallel
            const [jobs, totalCount] = await Promise.all([
                JobData.find(query)
                    .sort({ createdAt: -1 })
                    .select('-__v')
                    .skip(offset)
                    .limit(limit)
                    .lean(),
                JobData.countDocuments(query)
            ]);

            // Batch load company images to avoid N+1 populate queries
            const companyNames = [...new Set(jobs.map(j => j.companyName).filter(Boolean))];
            const companies = companyNames.length > 0
                ? await Company.find({ companyName: { $in: companyNames } })
                    .select('companyName imageUrl')
                    .lean()
                : [];
            const companyImageMap = {};
            companies.forEach(c => {
                companyImageMap[c.companyName] = c.imageUrl ? c.imageUrl.replace(/\\/g, '/') : null;
            });

            // Deduplicate by redirectUrl and attach company image
            const seenUrls = new Set();
            const filteredJobs = [];
            jobs.forEach(job => {
                if (!seenUrls.has(job.redirectUrl)) {
                    seenUrls.add(job.redirectUrl);
                    filteredJobs.push({
                        ...job,
                        companyImageUrl: companyImageMap[job.companyName] || null
                    });
                }
            });

            return {
                totalCount: totalCount,
                jobs: filteredJobs,
                hideLoadMore: (limit + offset >= totalCount)
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
    updateJob: async (id, status) => {
        try {
            if (!id) {
                throw new Error('ID is required');
            }
    
            const updateData = {
                isActive: status,
                updatedAt: new Date(),
                redirectUrl: `https://jobing.az/vakansiyalar/${id}/details`,
            };
    
            const job = await JobData.findByIdAndUpdate(id, updateData, { new: true });
    
            if (!job) {
                throw new Error('Job not found');
            }
    
            return 'Job updated';
        } catch (error) {
            console.error('Error updating job:', error); // Konsola detaylı hata yazdır
            throw error; // Orijinal hatayı yeniden fırlat
        }
    },
    

    // Delete job data
    incrementViewCount: async (id) => {
        return JobData.findByIdAndUpdate(id, { $inc: { viewCount: 1 } }).exec();
    },

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
    },

    addJobRequest: async (data) => {
        try {
            const job = new JobData(data);
            const savedJob = await job.save();
            savedJob.uniqueKey = savedJob._id.toString();
            savedJob.slug = generateSlug(data.title || 'job', savedJob._id.toString());
            savedJob.redirectUrl = '/vakansiyalar/' + encodeURIComponent(savedJob.slug) + '/details';
            await savedJob.save();
            return { status: 200, message: 'Məlumat uğurla əlavə edildi!', "id": savedJob._id, slug: savedJob.slug, redirectUrl: savedJob.redirectUrl };
        } catch (error) {
            throw new Error('Error adding job request: ' + error.message);
        }
    },

    // Job details
    details: async (id) => {
        try {
            // Try to find by slug, uniqueKey, or _id — use findOne which is simpler than aggregate for single docs
            const query = {
                $or: [
                    { slug: id },
                    { uniqueKey: id },
                    ...(mongoose.Types.ObjectId.isValid(id) ? [{ _id: new mongoose.Types.ObjectId(id) }] : [])
                ]
            };

            const job = await JobData.findOne(query).lean();

            if (!job) {
                throw new Error('Job not found');
            }

            // Single batch lookup for company
            if (job.companyName) {
                const company = await Company.findOne({ companyName: job.companyName })
                    .select('imageUrl')
                    .lean();
                if (company?.imageUrl) {
                    const idx = company.imageUrl.indexOf('src/Public');
                    job.companyImage = idx !== -1
                        ? company.imageUrl.slice(idx + 10)
                        : company.imageUrl;
                } else {
                    job.companyImage = null;
                }
            } else {
                job.companyImage = null;
            }

            // Also fetch category name
            if (job.categoryId != null) {
                const Category = mongoose.model('Category');
                const cat = await Category.findOne({ localCategoryId: String(job.categoryId) })
                    .select('categoryName')
                    .lean();
                job.category = cat?.categoryName || null;
            } else {
                job.category = null;
            }

            return job;
        } catch (error) {
            console.error('Error fetching job:', error);
            throw error;
        }
    },
    

    findByCompany: async (companyName, companyId) => {
        try {
            if (!companyName && !companyId) return [];
            const query = { isActive: true };
            if (companyName && companyId) {
                query.$or = [
                    { companyName },
                    { companyId: companyId.toString() }
                ];
            } else if (companyId) {
                query.companyId = companyId.toString();
            } else {
                query.companyName = companyName;
            }
            return JobData.find(query)
                .sort({ createdAt: -1 })
                .select('-description')
                .limit(50)
                .lean();
        } catch (error) {
            throw new Error('Error fetching company jobs: ' + error.message);
        }
    },

    count: async () => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        return JobData.countDocuments({
            createdAt: { $gte: thirtyDaysAgo }
        });
    },

    /** Get top 8 categories with most active job listings from the last 30 days */
    getTopCategories: async () => {
        try {
            const cached = Cache.get('top-categories');
            if (cached) return cached;

            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            const result = await JobData.aggregate([
                { $match: { isActive: true, createdAt: { $gte: thirtyDaysAgo } } },
                { $group: { _id: '$categoryId', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 8 },
                {
                    $lookup: {
                        from: 'categories',
                        let: { catId: { $toString: '$_id' } },
                        pipeline: [
                            { $match: { $expr: { $eq: ['$localCategoryId', '$$catId'] } } }
                        ],
                        as: 'category'
                    }
                },
                { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
                {
                    $project: {
                        _id: 0,
                        categoryId: '$_id',
                        name: { $ifNull: ['$category.categoryName', 'Digər'] },
                        logoUrl: { $ifNull: ['$category.logoUrl', ''] },
                        icon: { $ifNull: ['$category.icon', 'fa-folder'] },
                        count: 1
                    }
                }
            ]);

            Cache.set('top-categories', result, 600); // 10 min cache
            return result;
        } catch (error) {
            throw new Error('Error fetching top categories: ' + error.message);
        }
    }
};

export default JobDataService;
