import mongoose from 'mongoose';

const { Schema } = mongoose;

const companySchema = new Schema({
    companyName: {
        type: String,
        default: "",
    },
    imageUrl: {
        type: String,
        default: ""
    },
    bannerUrl: {
        type: String,
        default: ""
    },
    website: {
        type: String,
        default: ""
    },
    description: {
        type: String,
        default: ""
    },
    phone: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        default: ""
    },
    address: {
        type: String,
        default: ""
    },
    workingHours: {
        monday:   { type: String, default: "" },
        tuesday:  { type: String, default: "" },
        wednesday:{ type: String, default: "" },
        thursday: { type: String, default: "" },
        friday:   { type: String, default: "" },
        saturday: { type: String, default: "" },
        sunday:   { type: String, default: "" }
    },
    socialLinks: {
        facebook:  { type: String, default: "" },
        instagram: { type: String, default: "" },
        linkedin:  { type: String, default: "" },
        twitter:   { type: String, default: "" }
    },
    foundedYear: {
        type: Number,
        default: null
    },
    employeeCount: {
        type: String,
        default: ""
    },
    industry: {
        type: String,
        default: ""
    },
    companyId: {
        type: Number,
        default: null
    },
    uniqueKey: {
        type: String,
        default: null
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
