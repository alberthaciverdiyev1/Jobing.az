import JobData from '../Models/JobData.js';
import { Sequelize, Op } from 'sequelize';
import Company from "../Models/Company.js";
import Category from "../Models/Category.js";

const JobDataService = {
    // Create new job data (insert multiple records)

    create: async (data) => {
        console.log(data);
        if (!Array.isArray(data) || data.length === 0) {
            throw new Error('Data must be a non-empty array');
        }

        try {
            // Extract redirectUrl values from input data
            const redirectUrls = data.map(job => job.redirect_url);

            // Check for existing records with matching redirectUrl
            const existingRecords = await JobData.findAll({
                where: {
                    redirect_url: {
                        [Sequelize.Op.in]: redirectUrls
                    }
                },
                attributes: ['redirect_url']
            });

            // Extract existing redirectUrls into a Set
            const existingData = new Set(existingRecords.map(record => record.redirect_url));

            // Filter out the jobs that already exist in the database
            data = data.filter(job => !existingData.has(job.redirect_url));

            if (data.length > 0) {
                // Insert new records
                const results = await JobData.bulkCreate(data);

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
            // Get the date 30 days ago
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            // Fetch all jobs created in the last 30 days, sorted by createdAt
            const allJobs = await JobData.findAll({
                where: {
                    created_at: {
                        [Sequelize.Op.gte]: thirtyDaysAgo,
                    },
                },
                order: [['created_at', 'DESC']],
            });

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
                const unique_key = job.unique_key;
                if (seenUniqueKeys.has(unique_key)) {
                    const previousJob = seenUniqueKeys.get(unique_key);
                    duplicateIds.push(previousJob.id);
                    seenUniqueKeys.set(unique_key, job);
                } else {
                    seenUniqueKeys.set(unique_key, job);
                }
            });

            if (duplicateIds.length > 0) {
                // Delete the duplicate records
                await JobData.destroy({
                    where: {
                        id: {
                            [Sequelize.Op.in]: duplicateIds,
                        },
                    },
                });

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
            const seenUrls = new Set();
            const currentDate = new Date();
            const thirtyDaysAgo = new Date(currentDate.setDate(currentDate.getDate() - 30));

            const query = {
                is_active: true,
                created_at: { [Sequelize.Op.gte]: thirtyDaysAgo } // Last 30 days
            };

            const filters = [
                { key: 'category_id', type: 'int' },
                { key: 'city_id', type: 'int' },
                { key: 'education_id', type: 'int' },
                { key: 'experience_id', type: 'int', alias: 'experience' },
                { key: 'job_type', type: 'string' },
            ];

            filters.forEach(({ key, type, alias }) => {
                const value = data[alias || key];
                if (value !== undefined) {
                    if (type === 'int' && !isNaN(Number(value))) query[key] = Number(value);
                    else if (type === 'string' && value.trim()) query[key] = value;
                }
            });

            if (!data.all_jobs) query.source_url = 'jobing.az';

            if (data.min_salary && !isNaN(Number(data.min_salary)) && data.min_salary !== 0) {
                query.min_salary = { [Sequelize.Op.gte]: Number(data.min_salary) };
            }

            if (data.max_salary && !isNaN(Number(data.max_salary))) {
                query.max_salary = { [Sequelize.Op.lte]: Number(data.max_salary) };
            }

            if (data.keyword) {
                const keywordQuery = { [Sequelize.Op.iLike]: `%${data.keyword}%` };
                query[Sequelize.Op.or] = [
                    { title: keywordQuery },
                    { description: keywordQuery },
                    { company_name: keywordQuery },
                    { location: keywordQuery },
                ];
            }

            const limit = 100;
            const offset = Number(data.offset) || 0;

            const jobs = await JobData.findAll({
                where: query,
                order: [['created_at', 'DESC']],
                offset,
                limit,
                raw: true
            });

            const companies = await Company.findAll({
                attributes: ['company_name', 'image_url'],
            });

            const companyMap = companies.reduce((acc, company) => {
                acc[company.company_name] = company.image_url;
                return acc;
            }, {});

            const filteredJobs = jobs
                .map(job => ({
                    ...job,
                    company_image_url: companyMap[job.company_name] || null,
                }))
                .filter(job => {
                    if (!seenUrls.has(job.redirect_url)) {
                        seenUrls.add(job.redirect_url);
                        return true;
                    }
                    return false;
                });

            const totalCount = await JobData.count({});

            return {
                totalCount,
                jobs: filteredJobs,
                hideLoadMore: limit + offset >= totalCount,
            };
        } catch (error) {
            throw new Error(`Error retrieving jobs: ${error.message}`);
        }
    }
,
// Find a job by ID
    findSiteById: async (id) => {
        try {
            // Check if the ID is a valid number or string, depending on how IDs are structured in Sequelize
            if (!id || isNaN(Number(id))) {
                throw new Error('Invalid job ID format');
            }

            // Find the job by ID using Sequelize's `findByPk` method, assuming ID is primary key
            const job = await JobData.findByPk(id, {
                include: [
                    {
                        model: CompanyDetails,
                        attributes: ['imageUrl', 'companyName'],
                    },
                ],
            });

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

            // Update job using Sequelize's `update` method
            const [updatedRowsCount, updatedJobs] = await JobData.update(updateData, {
                where: { id: id },
                returning: true, // This ensures the updated row is returned
            });

            if (updatedRowsCount === 0) {
                throw new Error('Job not found');
            }

            // Assuming updatedJobs[0] is the updated job object
            return 'Job updated';
        } catch (error) {
            console.error('Error updating job:', error); // Log detailed error to the console
            throw error; // Rethrow the original error
        }
    },


    // Delete job data
// Delete job data
    deleteSite: async (id) => {
        try {
            if (!id || isNaN(Number(id))) {
                throw new Error('Invalid job ID format');
            }

            // Use Sequelize's `destroy` method to delete a record by its ID
            const deletedRows = await JobData.destroy({
                where: { id: id },
            });

            if (deletedRows === 0) {
                throw new Error('Job not found');
            }

            return { message: 'Job successfully deleted' };
        } catch (error) {
            throw new Error('Error deleting job: ' + error.message);
        }
    },

    addJobRequest: async (data) => {
        try {
            // Create a new job instance using the provided data
            const job = await JobData.create(data);

            // Assuming the unique key is based on the ID (converted to string)
            job.uniqueKey = job.id.toString();

            // Update the job with the uniqueKey
            await job.save();

            return { status: 200, message: 'Məlumat uğurla əlavə edildi!', id: job.id };
        } catch (error) {
            throw new Error('Error adding job request: ' + error.message);
        }
    },


// Job details
    details: async (id) => {
        try {
            // Find the job with the provided uniqueKey
            const job = await JobData.findOne({
                where: { uniqueKey: id },
                include: [{
                    model: Category,
                    as: 'category',
                    required: false, // You can change this to true if you want to make sure the job has an associated category
                    attributes: ['category_name'],
                    // Correct the condition to match categoryId between JobData and Category
                    where: {
                        categoryId: Sequelize.col('JobData.category_id') // Ensure it's referencing the correct column from JobData
                    }
                }]
            });

            // if (!job) {
            //     throw new Error('Job not found');
            // }
            //
            // // Add category field to job object
            // const category = job.category ? job.category.categoryName : null;
            // job.category = category;
            //
            // // Find the company details based on the company name
            // const company = await Company.findOne({ where: { companyName: job.companyName } });
            //
            // if (company && company.imageUrl) {
            //     let imageUrl = company.imageUrl;
            //     let index = imageUrl.indexOf('src/Public');
            //
            //     if (index !== -1) {
            //         job.companyImage = imageUrl.slice(index + 10);
            //     } else {
            //         job.companyImage = imageUrl;
            //     }
            // } else {
            //     job.companyImage = null;
            // }

            // Return the job with additional company image and category information
            return job;
        } catch (error) {
            console.error('Error fetching job:', error); // Log detailed error to console
            throw error; // Rethrow the original error
        }
    },

    count: async () => {
        try {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            // Use Sequelize's count method with a condition on the createdAt field
            const jobCount = await JobData.count({
                where: {
                    createdAt: {
                        [Sequelize.Op.gte]: thirtyDaysAgo
                    }
                }
            });

            return jobCount;
        } catch (error) {
            throw new Error('Error counting jobs: ' + error.message);
        }
    },

};

export default JobDataService;
