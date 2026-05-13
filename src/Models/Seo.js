import mongoose from 'mongoose';

const { Schema } = mongoose;

const seoSchema = new Schema({
    route: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    title: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    headerHtml: {
        type: String,
        default: ''
    },
    bodyTopHtml: {
        type: String,
        default: ''
    },
    bodyBottomHtml: {
        type: String,
        default: ''
    },
    footerHtml: {
        type: String,
        default: ''
    },
    ogTitle: {
        type: String,
        default: ''
    },
    ogDescription: {
        type: String,
        default: ''
    },
    ogImage: {
        type: String,
        default: ''
    },
    canonical: {
        type: String,
        default: ''
    },
    customRoute: {
        type: String,
        default: '',
        trim: true
    },
    noindex: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});

const Seo = mongoose.model('Seo', seoSchema);

export default Seo;
