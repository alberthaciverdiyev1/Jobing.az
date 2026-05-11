import mongoose from 'mongoose';

const { Schema } = mongoose;

const educationSchema = new Schema({
    school: { type: String, required: true },
    degree: { type: String, required: true },
    field: { type: String, required: true },
    startDate: { type: String },
    endDate: { type: String },
    description: { type: String }
}, { _id: false });

const experienceSchema = new Schema({
    company: { type: String, required: true },
    position: { type: String, required: true },
    startDate: { type: String },
    endDate: { type: String },
    description: { type: String }
}, { _id: false });

const languageSchema = new Schema({
    name: { type: String, required: true },
    level: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced', 'native'],
        default: 'intermediate'
    }
}, { _id: false });

const cvSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['created', 'uploaded'],
        default: 'created'
    },
    // Contact info
    fullName: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    // Professional info
    summary: { type: String, default: '' },
    skills: [{ type: String }],
    education: [educationSchema],
    experience: [experienceSchema],
    languages: [languageSchema],
    // Social links
    linkedin: { type: String, default: '' },
    website: { type: String, default: '' },
    // File upload info
    fileUrl: { type: String, default: null },
    fileName: { type: String, default: null },
    fileSize: { type: Number, default: null },
    mimeType: { type: String, default: null },
    // Status
    isActive: { type: Boolean, default: true },
    deletedAt: { type: Date, default: null }
}, {
    timestamps: true,
    versionKey: false
});

const CV = mongoose.model('CV', cvSchema);
export default CV;
