import CVService from '../Services/CVService.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { sendNewCVRequest } from '../Helpers/TelegramBot.js';

// Ensure upload directory exists
const cvDir = 'uploads/cv/';
if (!fs.existsSync(cvDir)) {
    fs.mkdirSync(cvDir, { recursive: true });
}

// Configure multer for CV file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/cv/');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `cv-${uuidv4()}${ext}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowed = ['.pdf', '.doc', '.docx', '.txt', '.rtf'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Yalnız PDF, DOC, DOCX, TXT və RTF faylları yüklənə bilər'), false);
    }
};

export const uploadCV = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB
}).single('cvFile');

const CVController = {
    // Create a new CV from form data
    create: async (req, res) => {
        try {
            const data = {
                userId: req.user._id,
                title: req.body.title,
                type: 'created',
                isActive: false,
                fullName: req.body.fullName || '',
                email: req.body.email || '',
                phone: req.body.phone || '',
                address: req.body.address || '',
                summary: req.body.summary || '',
                skills: req.body.skills ? (Array.isArray(req.body.skills) ? req.body.skills : req.body.skills.split(',').map(s => s.trim())) : [],
                education: req.body.education ? (typeof req.body.education === 'string' ? JSON.parse(req.body.education) : req.body.education) : [],
                experience: req.body.experience ? (typeof req.body.experience === 'string' ? JSON.parse(req.body.experience) : req.body.experience) : [],
                languages: req.body.languages ? (typeof req.body.languages === 'string' ? JSON.parse(req.body.languages) : req.body.languages) : [],
                linkedin: req.body.linkedin || '',
                website: req.body.website || ''
            };

            const cv = await CVService.create(data);

            try {
                await sendNewCVRequest({
                    id: cv._id,
                    title: cv.title,
                    fullName: cv.fullName,
                    email: cv.email,
                    phone: cv.phone,
                    type: cv.type,
                    isActive: cv.isActive
                });
            } catch (tgErr) {
                console.error('Telegram CV notification failed:', tgErr.message);
            }

            res.status(201).json({ message: 'CV uğurla yaradıldı', cv });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Upload existing CV file
    upload: async (req, res) => {
        try {
            uploadCV(req, res, async (err) => {
                if (err) {
                    return res.status(400).json({ error: err.message || 'Fayl yükləmə xətası' });
                }

                if (!req.file) {
                    return res.status(400).json({ error: 'Fayl seçilməyib' });
                }

                const cv = await CVService.create({
                    userId: req.user._id,
                    title: req.body.title || req.file.originalname,
                    type: 'uploaded',
                    isActive: false,
                    fileUrl: `/uploads/cv/${req.file.filename}`,
                    fileName: req.file.originalname,
                    fileSize: req.file.size,
                    mimeType: req.file.mimetype
                });

                try {
                    await sendNewCVRequest({
                        id: cv._id,
                        title: cv.title,
                        fullName: cv.fullName,
                        email: cv.email,
                        phone: cv.phone,
                        type: cv.type,
                        isActive: cv.isActive
                    });
                } catch (tgErr) {
                    console.error('Telegram CV upload notification failed:', tgErr.message);
                }

                res.status(201).json({ message: 'CV uğurla yükləndi', cv });
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // List user's CVs
    list: async (req, res) => {
        try {
            const cvs = await CVService.findByUser(req.user._id);
            res.json({ cvs });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Get single CV
    getById: async (req, res) => {
        try {
            const cv = await CVService.findByIdAndUser(req.params.id, req.user._id);
            if (!cv) {
                return res.status(404).json({ error: 'CV tapılmadı' });
            }
            res.json({ cv });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Update CV
    update: async (req, res) => {
        try {
            const updatableFields = [
                'title', 'fullName', 'email', 'phone', 'address',
                'summary', 'skills', 'education', 'experience',
                'languages', 'linkedin', 'website'
            ];

            const data = {};
            updatableFields.forEach(field => {
                if (req.body[field] !== undefined) {
                    if (field === 'skills' && typeof req.body.skills === 'string') {
                        data.skills = req.body.skills.split(',').map(s => s.trim());
                    } else if ((field === 'education' || field === 'experience' || field === 'languages') && typeof req.body[field] === 'string') {
                        try { data[field] = JSON.parse(req.body[field]); } catch { data[field] = req.body[field]; }
                    } else {
                        data[field] = req.body[field];
                    }
                }
            });

            const cv = await CVService.update(req.params.id, req.user._id, data);
            if (!cv) {
                return res.status(404).json({ error: 'CV tapılmadı' });
            }
            res.json({ message: 'CV yeniləndi', cv });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Public: list active CVs (limited info)
    publicList: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            const result = await CVService.findPublicList(page, limit);
            res.json(result);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Public: single CV detail
    publicDetail: async (req, res) => {
        try {
            const cv = await CVService.findPublicById(req.params.id);
            if (!cv) {
                return res.status(404).json({ error: 'CV tapılmadı' });
            }
            res.json({ cv });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // Delete CV
    delete: async (req, res) => {
        try {
            const cv = await CVService.findByIdAndUser(req.params.id, req.user._id);
            if (!cv) {
                return res.status(404).json({ error: 'CV tapılmadı' });
            }

            if (cv.fileUrl) {
                await CVService.deleteFile(cv.fileUrl);
            }

            await CVService.softDelete(req.params.id, req.user._id);
            res.json({ message: 'CV silindi' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};

export default CVController;
