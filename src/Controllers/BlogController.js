import slugify from 'slugify';
import BlogService from "../Services/BlogService.js";
import fs from "fs";
import path from "path";
import Company from "../Models/Company.js";


const BlogController = {
    create: async (req, res) => {
        try {
            let imageUrl = ''
            if (req.body.data.imageUrl) {
                const blogFolder = `./src/Public/Images/BlogImages`;

                if (!fs.existsSync(blogFolder)) {
                    fs.mkdirSync(blogFolder, { recursive: true });
                }

                let filePath = '';
                let ext = 'png';

                const match = req.body.data.imageUrl.match(/^data:(.*?);base64,/);
                if (match) {
                    const mimeType = match[1];
                    const type = mimeType.split('/')[1];
                    ext = type;
                }

                const base64Data = req.body.data.imageUrl.split(';base64,').pop();

                const uniqueSuffix = `${Date.now()}_${Math.floor(Math.random() * 100000)}`;
                const fileName = `img_${uniqueSuffix}.${ext}`;
                filePath = path.join(blogFolder, fileName);

                fs.writeFileSync(filePath, base64Data, { encoding: 'base64' });
                console.log(`Image saved at ${filePath}`);

                imageUrl = `/Images/BlogImages/${fileName}`;
            }



            let data = {
                description: req.body.data.description,
                name: req.body.data.name,
                isActive: req.body.data.status === 'on',
                imageUrl: imageUrl,
                slug: slugify(req.body.data.name, {
                    lower: true,
                    strict: true,
                }) + '-' + Math.floor(Math.random() * 100000),
            }
            console.log(data);
            const blog = await BlogService.create(data);
            res.status(200).json(blog);
        } catch (error) {
            res.status(500).json({message: 'Error retrieving blog: ' + error.message});
        }
    },

    getAll: async (req, res) => {
        try {
            const blogs = await BlogService.getAll(req.query);
            console.log(blogs);
            res.status(200).json(blogs);
        } catch (error) {
            res.status(500).json({message: 'Error retrieving company: ' + error.message});
        }
    },

    findById: async (req, res) => {
        try {
            const company = await CityService.findById(req.params.id);
            if (!company) {
                return res.status(404).json({message: 'Company not found'});
            }
            res.status(200).json(company);
        } catch (error) {
            res.status(500).json({message: 'Error retrieving company: ' + error.message});
        }
    },

    update: async (req, res) => {
        try {
            const company = await CityService.update(req.params.id, req.body);
            if (!company) {
                return res.status(404).json({message: 'Company not found'});
            }
            res.status(200).json(company);
        } catch (error) {
            res.status(500).json({message: 'Error updating company: ' + error.message});
        }
    },

    delete: async (req, res) => {
        try {
            await CityService.delete(req.params.id);
            res.status(200).json({message: 'Company successfully deleted'});
        } catch (error) {
            res.status(500).json({message: 'Error deleting company: ' + error.message});
        }
    }
};

export default BlogController;
