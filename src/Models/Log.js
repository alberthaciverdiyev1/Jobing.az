import mongoose from 'mongoose';

const LogSchema = new mongoose.Schema({
    level: {
        type: String,
        enum: ['info', 'warn', 'error'],
        default: 'info',
    },
    source: {
        type: String,
        default: 'app',
    },
    message: {
        type: String,
        required: true,
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
    },
    url: String,
    method: String,
    ip: String,
}, {
    timestamps: true,
});

LogSchema.index({ createdAt: -1 });
LogSchema.index({ level: 1, createdAt: -1 });
LogSchema.index({ source: 1, createdAt: -1 });

export default mongoose.model('Log', LogSchema);
