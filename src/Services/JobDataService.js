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
            const redirectUrls = data.map(job => job.redirect_url);

            const existingRecords = await JobData.findAll({
                where: {
                    redirect_url: {
                        [Sequelize.Op.in]: redirectUrls
                    }
                },
                attributes: ['redirect_url']
            });

            const existingData = new Set(existingRecords.map(record => record.redirect_url));

            data = data.filter(job => !existingData.has(job.redirect_url));

            if (data.length > 0) {
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
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

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

            const totalCount = await JobData.count({ where: query });

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
    findSiteById: async (id) => {
        try {
            if (!id || isNaN(Number(id))) {
                throw new Error('Invalid job ID format');
            }

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

            const [updatedRowsCount, updatedJobs] = await JobData.update(updateData, {
                where: { id: id },
                returning: true,
            });

            if (updatedRowsCount === 0) {
                throw new Error('Job not found');
            }

            return 'Job updated';
        } catch (error) {
            console.error('Error updating job:', error);
            throw error;
        }
    },


    // Delete job data
    deleteSite: async (id) => {
        try {
            if (!id || isNaN(Number(id))) {
                throw new Error('Invalid job ID format');
            }

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
            const job = await JobData.create(data);

            job.uniqueKey = job.id.toString();

            await job.save();

            return { status: 200, message: 'Məlumat uğurla əlavə edildi!', id: job.id };
        } catch (error) {
            throw new Error('Error adding job request: ' + error.message);
        }
    },


    details: async (id) => {
        try {
            const job = await JobData.findOne({
                where: { uniqueKey: id },
                include: [{
                    model: Category,
                    as: 'category',
                    required: false,
                    attributes: ['category_name'],
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
