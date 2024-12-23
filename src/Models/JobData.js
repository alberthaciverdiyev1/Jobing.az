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
    isActive: {
        type: Boolean,
        default: true
    },
    jobType: {
        type: String,
        required: false
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
