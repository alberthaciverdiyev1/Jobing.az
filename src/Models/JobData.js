import mongoose from 'mongoose';
import Enums from '../Config/Enums.js';

const { Schema } = mongoose;

const jobSchema = new Schema({
    uniqueKey: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
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
        required: false
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
    jobType: {
        type: String,
        required: true
    },
    postedAt: {
        type: Date,
        default: Date.now
    },
    sourceUrl: {
        type: String,
        required: true
    },
    redirectUrl: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
});

jobSchema.virtual('companyDetails', {
    ref: 'Company',
    localField: 'companyName',
    foreignField: 'companyName',
    justOne: true
});

const Job = mongoose.model('Job', jobSchema);

export default Job;
