import mongoose from 'mongoose';
import Enums from '../Config/Enums.js';

const { Schema } = mongoose;

const foreignCategorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    categoryId: {
        type: Number,
        required: false
    },
    parentId: {
        type: Number,
        required: false
    },
    website: {
        type: String,
        required: true
    },
    websiteId: {
        type: String,
        enum: Enums.SitesWithId, 
        required: false
    }
}, {
    timestamps: true,
    versionKey: false
});

const ForeignCategory = mongoose.model('ForeignCategory', foreignCategorySchema);

export default ForeignCategory;
