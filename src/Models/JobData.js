import mongoose from 'mongoose';
import Enums from '../Config/Enums.js';

const { Schema } = mongoose;

const jobSchema = new Schema({
    uniqueKey: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        default: null
    },
    title: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false},
    phone: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    location: {
        type: String,
        required: false
    },
    minSalary: {
        type: Number,
        required: false
    },
    maxSalary: {
        type: Number,
        required: false
    },
    minAge: {
        type: Number,
        required: false
    },
    maxAge: {
        type: Number,
        required: false
    },
    currencySign: {
        type: String,
        default: "₼"
    },
    categoryId: {
        type: Number,
        ref: 'Category',
        required: false
    },
    subCategoryId: {
        type: Number,
        ref: 'Category',
        required: false
    },
    companyName: {
        type: String,
        required: false,
        trim: true
    },
    companyId: {
        type: String,
        required: false
    },
    cityId: {
        type: Number,
        required: false
    },
    educationId: {
        type: Number,
        required: false
    },
    experienceId: {
        type: Number,
        required: false
    },
    userName: {
        type: String,
        required: false
    },
    isPremium: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    jobType: {
        type: String,
        required: false
    },
    viewCount: {
        type: Number,
        default: 0
    },
    postedAt: {
        type: Date,
        default: Date.now
    },
    postedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    sourceUrl: {
        type: String,
        required: true
    },
    redirectUrl: {
        type: String,
        required: true
    },
    applicationMethod: {
        type: String,
        enum: ['cv', 'contact', 'both'],
        default: 'both'
    }
}, {
    timestamps: true,
    versionKey: false
});

// Text index for full-text search across multiple fields
jobSchema.index({ title: 'text', companyName: 'text', description: 'text', location: 'text', userName: 'text' });

// Performance indexes for frequent queries
jobSchema.index({ isActive: 1, createdAt: -1 });
jobSchema.index({ categoryId: 1 });
jobSchema.index({ cityId: 1 });
jobSchema.index({ companyName: 1 });
jobSchema.index({ uniqueKey: 1 });
jobSchema.index({ slug: 1 });

jobSchema.virtual('companyDetails', {
    ref: 'Company',
    localField: 'companyName',
    foreignField: 'companyName',
    justOne: true
});

const Job = mongoose.model('Job', jobSchema);

export default Job;
