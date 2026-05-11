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
        return CV.find(filter).sort({ createdAt: -1 });
    },

    findById: async (id) => {
        return CV.findOne({ _id: id, deletedAt: null });
    },

    findByIdAndUser: async (id, userId) => {
        return CV.findOne({ _id: id, userId, deletedAt: null });
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

    deleteFile: async (fileUrl) => {
        if (!fileUrl) return;
        const filePath = path.resolve('.' + fileUrl);
        try {
            await fs.promises.unlink(filePath);
        } catch {
            // file may not exist
        }
    }
};

export default CVService;
