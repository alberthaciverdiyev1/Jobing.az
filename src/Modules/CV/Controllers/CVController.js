import CVService from '../Services/CVService.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const cvDir = path.resolve('uploads/cv');
if (!fs.existsSync(cvDir)) fs.mkdirSync(cvDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/cv/'),
    filename: (req, file, cb) => cb(null, `cv-${uuidv4()}${path.extname(file.originalname)}`)
});

export const uploadCV = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowed = ['.pdf', '.doc', '.docx', '.txt', '.rtf'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowed.includes(ext)) cb(null, true);
        else cb(new Error('Yalnız PDF, DOC, DOCX, TXT və RTF faylları yüklənə bilər'), false);
    },
    limits: { fileSize: 10 * 1024 * 1024 }
}).single('cvFile');

const CVController = {
    // GET /profil/cvlarim
    list: async (req, res, next) => {
        try {
            const cvs = await CVService.getMyCVs(req.user.id);
            res.render('Main', {
                title: 'Mənim CV-lərim',
                body: 'Profile/MyCVs.ejs',
                js: 'Profile.js',
                currentPage: 'profile-cvs',
                cvs
            });
        } catch (err) {
            next(err);
        }
    },

    // POST /profil/cv/create
    createPost: async (req, res, next) => {
        try {
            await CVService.createCV(req.body, req.user.id);
            res.redirect('/profil/cvlarim?success=true');
        } catch (err) {
            res.redirect(`/profil/cvlarim?error=${encodeURIComponent(err.message)}`);
        }
    },

    // POST /profil/cv/upload
    uploadPost: async (req, res, next) => {
        uploadCV(req, res, async (err) => {
            if (err) return res.redirect(`/profil/cvlarim?error=${encodeURIComponent(err.message)}`);
            if (!req.file) return res.redirect('/profil/cvlarim?error=Fayl secilmeyib');
            
            try {
                await CVService.uploadCVFile(req.body.title, req.file, req.user.id);
                res.redirect('/profil/cvlarim?success=true');
            } catch (serviceErr) {
                res.redirect(`/profil/cvlarim?error=${encodeURIComponent(serviceErr.message)}`);
            }
        });
    },

    // POST /profil/cv/:id/delete
    deletePost: async (req, res, next) => {
        try {
            await CVService.deleteCV(req.params.id, req.user.id);
            res.redirect('/profil/cvlarim?deleted=true');
        } catch (err) {
            res.redirect(`/profil/cvlarim?error=${encodeURIComponent(err.message)}`);
        }
    }
};

export default CVController;
