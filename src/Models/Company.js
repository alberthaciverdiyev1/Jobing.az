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
    website: {
        type: String,
        required: false
    },
    companyId: {
        type: Number,
        required: false
    },
    uniqueKey: {
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
