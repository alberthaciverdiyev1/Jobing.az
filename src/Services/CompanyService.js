import Company from '../Models/Company.js';
import pLimit from "p-limit";
import mime from "mime-types";
import fs from "fs";
import path from "path";
import axios from "axios";

const CompanyService = {
    // Create a company
    create: async (data) => {
        try {
            if (!Array.isArray(data)) {
                throw new Error('Data must be an array');
            }
            // const existingRecords = await Company.find({
            //     redirectUrl: { $in: data.map(company => company.redirectUrl) }
            // }).select('redirectUrl');

            // if (existingRecords.length > 0) {
            //     const existingData = new Set(existingRecords.map(record => record.redirectUrl));
            //     data = data.filter(company => !existingData.has(company.redirectUrl));
            // }

            if (data.length > 0) {
                const results = await Company.insertMany(data);
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
        return Company.countDocuments();
    },
    // Get all companies
    getAll: async () => {
        try {
            return await Company.find({});
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
                        if (company.imageUrl && company.imageUrl !== '/nologo.png' && (company.imageUrl.startsWith('http') || company.imageUrl.startsWith('https') || company.imageUrl.includes('/'))) {
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

                            const fileName = `${company.companyName || 'default'}.${ext}`;
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

                            company.imageUrl = localFilePath;
                            await CompanyService.updateCompanyImageUrl(company._id, localFilePath);
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
            await Company.findByIdAndUpdate(companyId, { imageUrl: newImagePath });
        } catch (error) {
            throw new Error(`Error updating image URL for company with ID ${companyId}: ${error.message}`);
        }
    },

    removeDuplicates: async () => {
        try {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const companiesList = await Company.find({
                createdAt: { $gte: thirtyDaysAgo },
            }).sort({ createdAt: -1 });

            if (!companiesList || companiesList.length === 0) {
                return {
                    status: 200,
                    message: 'No data found for the last 30 days.',
                    count: 0,
                };
            }

            const seenUniqueKeys = new Map();
            const duplicateIds = [];

            companiesList.forEach(c => {
                const uniqueKey = c.uniqueKey;
                if (seenUniqueKeys.has(uniqueKey)) {
                    const previousCompany = seenUniqueKeys.get(uniqueKey);
                    duplicateIds.push(previousCompany._id);
                    seenUniqueKeys.set(uniqueKey, c);
                } else {
                    seenUniqueKeys.set(uniqueKey, c);
                }
            });

            if (duplicateIds.length > 0) {
                await Company.deleteMany({ _id: { $in: duplicateIds } });
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
    // Find a company by ID
    findById: async (id) => {
        try {
            const company = await Company.findById(id);
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
            const company = await Company.findById(id);
            if (!company) {
                throw new Error('Company not found');
            }
            await company.updateOne(updateData);
            return company;
        } catch (error) {
            throw new Error('Error updating company: ' + error.message);
        }
    },

    // Delete a company
    delete: async (id) => {
        try {
            const company = await Company.findById(id);
            if (!company) {
                throw new Error('Company not found');
            }
            await company.remove();
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

            const company = new Company(data);
            const savedCompany = await company.save();

            return { status: 200, message: 'Məlumat uğurla əlavə edildi!' };
        } catch (error) {
            throw new Error('Error adding company: ' + error.message);
        }
    }

};

export default CompanyService;
