import mongoose from 'mongoose';

const { Schema } = mongoose;

const visitorSchema = new Schema({
    visitIp: {
        type: String,
        required: true,
        unique: true
    },
    lastVisit: {
        type: Date,
        default: Date.now
    },
    visitCount: {
        type: Number,
        default: 1
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
