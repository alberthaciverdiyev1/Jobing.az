import mongoose from 'mongoose';

const { Schema } = mongoose;

const siteSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    deletedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true,
    versionKey: false
});

const Site = mongoose.model('Site', siteSchema);

export default Site;
