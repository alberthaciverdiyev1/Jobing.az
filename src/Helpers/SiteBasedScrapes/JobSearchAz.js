import enums from "../../Config/Enums.js";
import pLimit from 'p-limit';
import axios from 'axios';
import randomUserAgent from "../../Config/UserAgents.js";
import smartJobAz from "./SmartJobAz.js";
import CompanyService from "../../Services/CompanyService.js";


class JobSearchAz {
    constructor(url = enums.Sites.JobSearchAz) {
        this.url = url;
    };


    async Jobs(categories, bossAzCity,main) {
        let splitCategories = categories
            .flatMap(c => c.jobSearch.split(','))
            .map(jobId => jobId.trim())
            .filter(jobId => jobId !== '')
            .map(jobId => ({
                localCategoryId: categories.find(c => c.jobSearch.includes(jobId)).localCategoryId,
                jobsearchId: jobId,
            }))
            .filter(c => c.jobsearchId !== '');

        const city = Object.entries(enums.Cities.JobSearchAz).find(
            ([k, v]) => v === bossAzCity.name
        );
        const cityId = city ? city[0] : null;

        const experience = {
            "7751": "Təcrübəçi",
            "7752": "Köməkçi",
            "7753": "Mütəxəssis",
            "7754": "Menecer",
            "7755": "Direktor",
            "7756": "Yuxarı rəhbərlik"
        }

        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        try {
            // const filteredCategories = categories.filter(c => c.website === enums.SitesWithId.JobSearchAz);

            const limit = pLimit(1);
            const dataPromises = [];
            const jobData = [];
            const companyData = [];

            // console.log("JobSearch",cityId,splitCategories)
            if (cityId && (main ? true : (bossAzCity.name !== "Bakı" ? true : false))) {

                Object.entries(splitCategories).forEach(([no, category]) => {
                    Object.entries(experience).forEach(([experienceId]) => {
                        const randomDelay = Math.floor(Math.random() * 15000) + 1000;
                        delay(randomDelay);
                        const requestPromise = limit(async () => {
                            try {
                                const url = 'https://www.jobsearch.az/api-az/vacancies-az';
                                const params = {
                                    hl: 'az',
                                    q: '',
                                    posted_date: '',
                                    seniority: experienceId,
                                    categories: category.jobsearchId,
                                    industries: '',
                                    ads: '',
                                    location: cityId,
                                    job_type: '',
                                    salary: '',
                                    order_by: '',
                                };
                                const headers = {
                                    'Accept': 'application/json, text/plain, */*',
                                    'Accept-Encoding': 'gzip, deflate, br',
                                    'Accept-Language': 'en-US,en;q=0.9,tr-TR;q=0.8,tr;q=0.7,az;q=0.6',
                                    'User-Agent': randomUserAgent(),
                                    'Referer': 'https://www.jobsearch.az/vacancies',
                                    'X-Requested-With': 'XMLHttpRequest',
                                    'Cookie': '_gcl_au=1.1.1478270619.1728892071; _ga=GA1.2.819498558.1728892071; _gid=GA1.2.336870678.1732861221; JOB_SEARCH=eyJpdiI6ImprZTIyTExHWm5JZ3BBS3ArMG42MFE9PSIsInZhbHVlIjoibERNV1gyMjh5aFRMK3RvaXV1QTFKUXNPWGprQnNaWWVJem5aMktGTjVEVkZ3VHNTYXkzZ0JZVWNCS2dteW51SDY3VXpwY2JKUnVCcFVKS2xsZXNyZHczdXBpVXhQQjRWNVVOWE1ZeDBaZDhpbjhURE45VDFLR29CbFQyU3RQM3kiLCJtYWMiOiIzM2ZiNzc2N2FiYzYxOTQ1OGIxODdmNDBjMDg1MmY4YTJkYTg5YmQ3MzY3NzZkZjFjODk1NDE2MmExYzRkZDY0IiwidGFnIjoiIn0%3D',
                                };

                                const timeoutPromise = new Promise((_, reject) =>
                                    setTimeout(() => reject(new Error('Request timed out')), 30000)
                                );

                                const response = await Promise.race([axios.post(url, params, { headers }), timeoutPromise]);
                                // console.log(response.data.items);return;
                                Object.values(response.data.items).forEach(element => {

                                    jobData.push({
                                        title: element.title,
                                        companyName: element.company.title,
                                        minSalary: element.salary ?? 0,
                                        maxSalary: element.salary ?? 0,
                                        location: bossAzCity.name,
                                        cityId: bossAzCity?.cityId || null,
                                        description: element.text || null,
                                        jobId: element.id,
                                        isPremium: element?.is_vip,
                                        categoryId: category.localCategoryId,
                                        sourceUrl: this.url,
                                        redirectUrl: `https://www.jobsearch.az/vacancies/${element.slug}`,
                                        jobType: '0x001',
                                        educationId: null,
                                        experienceId: this.mapExperience(experienceId),
                                        uniqueKey: `${element.title}-${element?.company.title}-${bossAzCity.name}`
                                    });
                                    companyData.push({
                                        companyName: element?.company?.title,
                                        imageUrl: element?.company?.logo_mini,
                                        website: enums.SitesWithId.JobSearchAz,
                                        uniqueKey: `${element?.company?.title}-${element?.company?.logo_mini}`
                                    });
                                });

                            } catch (error) {
                                console.error('Error or timeout:', error.message);
                            }
                        });
                        dataPromises.push(requestPromise);
                    });
                });
            }

            const results = await Promise.all(dataPromises);
            const data = results.flat();
            const companyResult = await CompanyService.create(companyData);

            if (companyResult.status === 200 || companyResult.status === 201) {
                return jobData;
            }
        } catch (error) {
            console.error('Error fetching jobs:', error.message, error.stack);
            throw new Error('Error fetching jobs');
        }
    }

    mapExperience(experienceId) {
        switch (experienceId) {
            case 7755:
            case 7756:
                return enums.Experience.Director;
            case 7751:
            case 7752:
                return enums.Experience.Entry;
            case 7753:
                return enums.Experience.Middle;
            case 7754:
                return enums.Experience.Senior;
            default:
                return 0;
        }
    }
}

export default JobSearchAz;
