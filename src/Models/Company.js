import mongoose from 'mongoose';

const { Schema } = mongoose;

const companySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    website: {
        type: String,
        required: false
    },
    contactInfo: {
        type: String,
        required: false
    },
    location: {
        type: String,
        required: false
    },
    industry: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    deletedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true,
    versionKey: false
});

const Company = mongoose.model('Company', companySchema);

export default Company;
