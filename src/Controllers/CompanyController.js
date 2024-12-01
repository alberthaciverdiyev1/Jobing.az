import BossAz from '../Helpers/SiteBasedScrapes/BossAz.js';
import SmartJobAz from '../Helpers/SiteBasedScrapes/SmartJobAz.js';
import CompanyService from '../Services/CompanyService.js';
import path from 'path';
import fs from 'fs';
import mime from 'mime-types'
import axios from 'axios';

const CompanyController = {
    create: async (req, res) => {
        try {
            const boss = new BossAz;
            const smartJob = new SmartJobAz;

            const bossAzCompanies = await boss.Companies();
            // const smartJobCategories = await smartJob.Categories(); 
            // let categories = [...smartJobCategories, ...bossAzCategories];

            const response = await CompanyService.create(bossAzCompanies);
            res.status(response.status).json({ message: response.message, count: response.count })
        } catch (error) {
            res.status(500).json({ message: 'Error creating company: ' + error.message });
        }
    },

    removeDuplicates: async (req, res) => {
        try {
            const response = await CompanyService.removeDuplicates();
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ message: 'Error updating site: ' + error.message });
        }
    },

    downloadCompanyLogos: async (req, res) => {
        try {
            const companies = await CompanyService.getAll();
            console.log(companies);
            const updatedCompanies = await Promise.all(
                companies.map(async (company) => {
                    if (company.imageUrl && (company.imageUrl.startsWith('http') || company.imageUrl.startsWith('https') || company.imageUrl.includes('/'))) {
console.log("1")
                       
                        const imageUrl = company.imageUrl.startsWith('http') || company.imageUrl.startsWith('https')
                            ? company.imageUrl
                            : `http://${company.imageUrl}`;

                        const ext = mime.extension(mime.lookup(imageUrl));
                        if (!ext) {
                            throw new Error(`Unable to determine the file extension for URL: ${imageUrl}`);
                        }

                        const companyFolder = `./src/Public/Images/CompanyLogos`;
                        if (!fs.existsSync(companyFolder)) {
                            fs.mkdirSync(companyFolder, { recursive: true });
                        }

                        const localFilePath = path.join(companyFolder, `${company.companyName || 'default'}.${ext}`);

                        const response = await axios({
                            imageUrl,
                            method: 'GET',
                            responseType: 'stream',
                        });
                
                        new Promise((resolve, reject) => {
                            const writer = fs.createWriteStream(filepath);
                            response.data.pipe(writer);
                
                            writer.on('finish', resolve);
                            writer.on('error', reject);
                        });

                        company.imageUrl = localFilePath; 
                        await CompanyService.updateCompanyImageUrl(company._id, localFilePath);

                    }
                    return company;
                })
            );

            res.status(200).json(updatedCompanies);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error retrieving companies: ' + error.message });
        }
    },

    findById: async (req, res) => {
        try {
            const company = await CompanyService.findById(req.params.id);
            if (!company) {
                return res.status(404).json({ message: 'Company not found' });
            }
            res.status(200).json(company);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving company: ' + error.message });
        }
    },

    update: async (req, res) => {
        try {
            const company = await CompanyService.update(req.params.id, req.body);
            if (!company) {
                return res.status(404).json({ message: 'Company not found' });
            }
            res.status(200).json(company);
        } catch (error) {
            res.status(500).json({ message: 'Error updating company: ' + error.message });
        }
    },

    delete: async (req, res) => {
        try {
            await CompanyService.delete(req.params.id);
            res.status(200).json({ message: 'Company successfully deleted' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting company: ' + error.message });
        }
    }
};

export default CompanyController;
