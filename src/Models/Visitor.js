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

visitorSchema.index({ ip: 1 });
visitorSchema.index({ lastVisit: 1 });
visitorSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 }); // Auto-delete after 90 days

const Visitor = mongoose.model('Visitor', visitorSchema);

export default Visitor;
