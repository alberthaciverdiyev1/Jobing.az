import Company from '../Models/Company.js';
import pLimit from 'p-limit';
import mime from 'mime-types';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { Op } from 'sequelize';

import sequelize from '../Config/Database.js';

const CompanyService = {
    // Create a company
    create: async (data) => {
        try {
            if (!Array.isArray(data)) {
                throw new Error('Data must be an array');
            }

            if (data.length > 0) {
                const results = await Company.bulkCreate(data);
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
            throw new Error('Error creating companies: ' + error.message);
        }
    },

    count: async () => {
        return Company.count();
    },

    // Get all companies
    getAll: async () => {
        try {
            return await Company.findAll();
        } catch (error) {
            throw new Error('Error retrieving companies: ' + error.message);
        }
    },

    downloadCompanyLogos: async (req, res) => {
        try {
            const companies = await CompanyService.getAll();
            const limit = pLimit(3);

            const updatedCompanies = await Promise.all(
                companies.map((company) => {
                    return limit(async () => {
                        if (company.image_url && company.image_url !== '/nologo.png' && (company.image_url.startsWith('http') || company.image_url.startsWith('https') || company.image_url.includes('/'))) {
                            const imageUrl = company.image_url.startsWith('http') || company.image_url.startsWith('https')
                                ? company.image_url
                                : `http://${company.image_url}`;

                            const ext = mime.extension(mime.lookup(imageUrl));
                            if (!ext) {
                                throw new Error(`Unable to determine the file extension for URL: ${imageUrl}`);
                            }

                            const companyFolder = `./src/Public/Images/CompanyLogos`;
                            if (!fs.existsSync(companyFolder)) {
                                fs.mkdirSync(companyFolder, { recursive: true });
                            }

                            const fileName = `${company.company_name || 'default'}.${ext}`;
                            if (!!/["<>|:*?\/\\]/.test(fileName)) {
                                return company;
                            }

                            const localFilePath = path.join(companyFolder, fileName);

                            const response = await axios({
                                url: imageUrl,
                                method: 'GET',
                                responseType: 'stream',
                            });

                            await new Promise((resolve, reject) => {
                                const writer = fs.createWriteStream(localFilePath);
                                response.data.pipe(writer);

                                writer.on('finish', resolve);
                                writer.on('error', reject);
                            });

                            company.image_url = localFilePath;
                            await CompanyService.updateCompanyImageUrl(company.id, localFilePath);
                        }
                        return company;
                    });
                })
            );

            return {
                status: 200,
                message: 'Downloaded All Company Logos',
                count: 0,
            };
        } catch (error) {
            console.error(error);
            return {
                status: 500,
                message: 'Error Download Company Logos',
                count: 0,
            };
        }
    },

    updateCompanyImageUrl: async (companyId, newImagePath) => {
        try {
            await Company.update({ image_url: newImagePath }, { where: { id: companyId } });
        } catch (error) {
            throw new Error(`Error updating image URL for company with ID ${companyId}: ${error.message}`);
        }
    },


     removeDuplicates : async () => {
        try {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const companies = await Company.findAll({
                where: { created_at: { [Op.gte]: thirtyDaysAgo } },
                order: [['created_at', 'DESC']],
                attributes: ['id', 'unique_key', 'created_at']
            });

            if (!companies.length) {
                return { status: 200, message: 'No data found for the last 30 days.', count: 0 };
            }
            const duplicateIds = [];
            const seenKeys = new Map();
            for (const company of companies) {
                const key = company.unique_key;

                if (seenKeys.has(key)) {
                    duplicateIds.push(company.id);
                } else {
                    seenKeys.set(key, company.id);
                }
            }

            if (duplicateIds.length > 0) {
                await Company.destroy({ where: { id: { [Op.in]: duplicateIds } } });
                return { status: 201, message: `Deleted ${duplicateIds.length} duplicate records.`, count: duplicateIds.length };
            }

            return { status: 200, message: 'No duplicate data found.', count: 0 };

        } catch (error) {
            console.error("Error in removeDuplicates:", error);
            return { status: 500, message: 'An error occurred.', error: error.message };
        }
    },
    // Find a company by ID
    findById: async (id) => {
        try {
            const company = await Company.findByPk(id);
            if (!company) {
                throw new Error('Company not found');
            }
            return company;
        } catch (error) {
            throw new Error('Error retrieving company: ' + error.message);
        }
    },

    // Update a company
    update: async (id, updateData) => {
        try {
            const company = await Company.findByPk(id);
            if (!company) {
                throw new Error('Company not found');
            }
            await company.update(updateData);
            return company;
        } catch (error) {
            throw new Error('Error updating company: ' + error.message);
        }
    },

    // Delete a company
    delete: async (id) => {
        try {
            const company = await Company.findByPk(id);
            if (!company) {
                throw new Error('Company not found');
            }
            await company.destroy();
            return { message: 'Company successfully deleted' };
        } catch (error) {
            throw new Error('Error deleting company: ' + error.message);
        }
    },

    addSingleCompany: async (data) => {
        try {
            const companyFolder = `./src/Public/Images/CompanyLogos`;

            if (!fs.existsSync(companyFolder)) {
                fs.mkdirSync(companyFolder, { recursive: true });
            }

            let filePath = '';
            if (data.imageUrl) {
                let ext = 'png';
                const match = data.imageUrl.match(/^data:(.*?);base64,/);
                if (match) {
                    const mimeType = match[1];
                    const type = mimeType.split('/')[1];
                    ext = type;
                }

                const base64Data = data.imageUrl.split(';base64,').pop();

                const sanitizedCompanyName = (data.companyName || 'default').replace(/["<>|:*?\/\\]/g, '_');
                const fileName = `${sanitizedCompanyName}.${ext}`;

                filePath = path.join(companyFolder, fileName);

                fs.writeFileSync(filePath, base64Data, { encoding: 'base64' });
                console.log(`Image saved at ${filePath}`);
            }

            if (filePath) {
                filePath = filePath.replace(/\//g, '\\');
            }
            data.imageUrl = filePath || null;
            if (data.companyName) {
                data.companyName = data.companyName.replace(/["<>|:*?\/\\]/g, '0');
            }

            const company = await Company.create(data);

            return { status: 200, message: 'Məlumat uğurla əlavə edildi!' };
        } catch (error) {
            throw new Error('Error adding company: ' + error.message);
        }
    }
};

export default CompanyService;
