import mongoose from 'mongoose';
import Enums from '../Config/Enums.js';

const { Schema } = mongoose;

const jobSchema = new Schema({
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
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: false
    },
    subCategoryId: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: false
    },
    companyName: {
        type: String,
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
        enum: Object.values(Enums.JobTypes),
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

const Job = mongoose.model('Job', jobSchema);

export default Job;
