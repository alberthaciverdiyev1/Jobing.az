import mongoose from 'mongoose';

const { Schema } = mongoose;

const newsSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    title_en: { type: String, default: '' },
    title_ru: { type: String, default: '' },
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
    description_en: { type: String, default: '' },
    description_ru: { type: String, default: '' },
    content: {
        type: String,
        default: ''
    },
    content_en: { type: String, default: '' },
    content_ru: { type: String, default: '' },
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
