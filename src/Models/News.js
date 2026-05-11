import mongoose from 'mongoose';

const { Schema } = mongoose;

const newsSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        unique: true,
        index: true
    },
    imageUrl: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    content: {
        type: String,
        default: ''
    },
    category: {
        type: String,
        default: ''
    },
    views: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    versionKey: false
});

const News = mongoose.model('News', newsSchema);

export default News;
