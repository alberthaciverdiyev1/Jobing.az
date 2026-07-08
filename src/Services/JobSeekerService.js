import mongoose from 'mongoose';
import JobSeeker from '../Models/JobSeeker.js';

function generateSlug(title) {
    const base = title
        .toLowerCase()
        .replace(/[^a-z0-9ıəöğüşç\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 80);
    const suffix = Date.now().toString().slice(-6);
    return `${base}-${suffix}`;
}

const JobSeekerService = {
    async create(data) {
        const slug = generateSlug(data.title);
        const doc = new JobSeeker({ ...data, slug });
        await doc.save();
        doc.slug = slug;
        return doc;
    },

    async getAll(filters = {}) {
        const { keyword, categoryId, cityId, educationId, experienceId, offset = 0, limit = 20 } = filters;
        const query = { isActive: true };

        if (keyword) {
            const terms = keyword.trim().split(/\s+/).filter(Boolean);
            if (terms.length > 0) {
                query.$and = terms.map(term => ({
                    $or: [
                        { title: { $regex: term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } },
                        { description: { $regex: term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } },
                        { userName: { $regex: term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } }
                    ]
                }));
            }
        }
        if (categoryId) query.categoryId = Number(categoryId);
        if (cityId) query.cityId = Number(cityId);
        if (educationId) query.educationId = Number(educationId);
        if (experienceId) query.experienceId = Number(experienceId);

        const [docs, total] = await Promise.all([
            JobSeeker.find(query, { viewers: 0 })
                .sort({ postedAt: -1 })
                .skip(Number(offset))
                .limit(Number(limit))
                .lean(),
            JobSeeker.countDocuments(query)
        ]);

        return { docs, total, totalCount: total };
    },

    async getById(id) {
        const query = mongoose.Types.ObjectId.isValid(id)
            ? { _id: id }
            : { slug: id };
        return await JobSeeker.findOne(query).lean();
    },

    async findByUser(userId) {
        return await JobSeeker.find({ postedBy: userId })
            .sort({ createdAt: -1 })
            .lean();
    },

    async delete(id, userId) {
        return await JobSeeker.findOneAndDelete({ _id: id, postedBy: userId });
    },

    async incrementViewCount(id, viewer = null) {
        const doc = await JobSeeker.findById(id);
        if (!doc) return null;

        // Increment view count on every view
        doc.viewCount = (doc.viewCount || 0) + 1;

        // Track unique viewers (only add if not already in list by userId)
        if (viewer && viewer.userId) {
            const viewerIdStr = viewer.userId.toString();
            const alreadyViewed = (doc.viewers || []).some(v =>
                v.userId && v.userId.toString() === viewerIdStr
            );
            if (!alreadyViewed) {
                if (!doc.viewers) doc.viewers = [];
                doc.viewers.push({
                    userId: viewer.userId,
                    userName: viewer.userName || '',
                    companyName: viewer.companyName || '',
                    viewedAt: new Date()
                });
            }
        }

        return await doc.save();
    },

    async toggleActive(id, isActive) {
        return await JobSeeker.findByIdAndUpdate(id, { isActive }, { new: true });
    }
};

export default JobSeekerService;
