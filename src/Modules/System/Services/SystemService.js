import VacancyRepository from '../../Vacancy/Repositories/VacancyRepository.js';
import CompanyRepository from '../../Company/Repositories/CompanyRepository.js';

class SystemService {
    async getHomeViewModel(locale = 'az') {
        const jobs = await VacancyRepository.model.findAll({
            where: { isActive: true },
            order: [['createdAt', 'DESC']],
            limit: 6,
            include: ['filterOptions']
        });

        // Quick mapper for home page jobs
        const formattedJobs = jobs.map(job => {
            const cityFilter = job.filterOptions?.find(f => f.Filter?.key === 'city');
            job.location = cityFilter ? cityFilter.name[locale] : job.location;
            return job;
        });

        return {
            title: 'Jobing.az — İş Elanları və Vakansiyalar',
            description: 'Azərbaycanda və regionda ən son iş elanları, vakansiyalar və karyera imkanları.',
            ogTitle: 'Jobing.az — İş Elanları',
            ogDescription: 'Azərbaycanda və regionda ən son iş elanları.',
            ogType: 'website',
            body: "Home/Index.ejs",
            js: "Home.js",
            currentPage: 'home',
            topJobs: formattedJobs,
            topCategories: [] // Can be implemented with FilterOptions if needed
        };
    }

    getSitemapXml() {
        return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://jobing.az/</loc><priority>1.00</priority></url>
  <url><loc>https://jobing.az/vakansiyalar</loc><priority>0.90</priority></url>
  <url><loc>https://jobing.az/sirketler</loc><priority>0.80</priority></url>
</urlset>`;
    }
}
export default new SystemService();
