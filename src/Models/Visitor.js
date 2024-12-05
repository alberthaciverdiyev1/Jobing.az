import mongoose from 'mongoose';

const { Schema } = mongoose;

const visitorSchema = new Schema({
    ip: {
        type: String,
        required: true
    },
    lastVisit: {
        type: Date,
        default: Date.now
    },
    visitCount: {
        type: Number,
        default: 1
    },
    userAgent: {
        type: String, 
        default: ''
    },
    deletedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true,
    versionKey: false
});

const Visitor = mongoose.model('Visitor', visitorSchema);

export default Visitor;
