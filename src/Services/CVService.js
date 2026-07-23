import CV from '../Models/CV.js';
import path from 'path';
import fs from 'fs';

const CVService = {
    create: async (data) => {
        const cv = new CV(data);
        return cv.save();
    },

    findByUser: async (userId, activeOnly = true) => {
        const filter = { userId, deletedAt: null };
        if (activeOnly) filter.isActive = true;
        return CV.find(filter).sort({ createdAt: -1 }).lean();
    },

    findById: async (id) => {
        return CV.findOne({ _id: id, deletedAt: null });
    },

    findByIdAndUser: async (id, userId) => {
        return CV.findOne({ _id: id, userId, deletedAt: null }).lean();
    },

    update: async (id, userId, data) => {
        return CV.findOneAndUpdate(
            { _id: id, userId, deletedAt: null },
            { $set: data },
            { new: true, runValidators: true }
        );
    },

    softDelete: async (id, userId) => {
        return CV.findOneAndUpdate(
            { _id: id, userId, deletedAt: null },
            { $set: { deletedAt: new Date(), isActive: false } },
            { new: true }
        );
    },

    // Public list of active CVs (limited fields for privacy)
    findPublicList: async (page = 1, limit = 20) => {
        const skip = (page - 1) * limit;
        const filter = { deletedAt: null, isActive: true };
        const total = await CV.countDocuments(filter);
        const cvs = await CV.find(filter)
            .populate('userId', 'name surname')
            .select('title fullName skills education summary fileUrl fileName type createdAt')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();
        return { cvs, total, page, totalPages: Math.ceil(total / limit) };
    },

    // Public detail - single CV with limited fields
    findPublicById: async (id) => {
        return CV.findOne({ _id: id, deletedAt: null, isActive: true })
            .populate('userId', 'name surname')
            .select('title fullName type fileUrl fileName mimeType summary skills education experience languages linkedin website createdAt')
            .lean();
    },

    deleteFile: async (fileUrl) => {
        if (!fileUrl) return;
        const filePath = path.resolve('.' + fileUrl);
        try {
            await fs.promises.unlink(filePath);
        } catch {
            // file may not exist
        }
    },

    toggleActive: async (id, status) => {
        return CV.findOneAndUpdate(
            { _id: id, deletedAt: null },
            { $set: { isActive: status } },
            { new: true }
        );
    }
};

export default CVService;
