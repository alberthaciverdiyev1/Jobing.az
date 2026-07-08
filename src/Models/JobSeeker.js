import mongoose from 'mongoose';

const jobSeekerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    userName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    cityId: {
        type: Number
    },
    categoryId: {
        type: Number
    },
    educationId: {
        type: Number
    },
    experienceId: {
        type: Number
    },
    isActive: {
        type: Boolean,
        default: false
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    postedAt: {
        type: Date,
        default: Date.now
    },
    viewCount: {
        type: Number,
        default: 0
    },
    cvUrl: {
        type: String
    },
    cvFileName: {
        type: String
    }
}, { timestamps: true, versionKey: false });

jobSeekerSchema.index({ title: 'text', description: 'text', userName: 'text' });

const JobSeeker = mongoose.model('JobSeeker', jobSeekerSchema);
export default JobSeeker;
