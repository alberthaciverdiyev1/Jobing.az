import mongoose from 'mongoose';

const { Schema } = mongoose;

const rssSourceSchema = new Schema({
    url: {
        type: String,
        required: true,
        trim: true
    },
    name: {
        type: String,
        default: ''
    },
    category: {
        type: String,
        default: ''
    },
    lastFetchedAt: {
        type: Date,
        default: null
    },
    type: {
        type: String,
        enum: ['news', 'blog'],
        default: 'news'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});

const RssSource = mongoose.model('RssSource', rssSourceSchema);

export default RssSource;
