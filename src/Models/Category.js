import mongoose from 'mongoose';

const { Schema } = mongoose;

const categorySchema = new Schema({
    localCategoryId: {
        type: String,
        required: false
    },
    categoryName: {
        type: String,
        required: false
    },
    smartJobAz: {
        type: String,
        required: false
    },
    offerAz: {
        type: String,
        required: false
    },
    jobSearch: {
        type: String,
        required: false
    },
    bossAz: {
        type: String,
        required: false
    },
    helloJobAz: {
        type: String,
        required: false
    }
}, { 
    timestamps: true,
    versionKey: false
});

categorySchema.virtual('Parent', {
    ref: 'Category',
    localField: 'localCategoryId',
    foreignField: 'id',
    justOne: true
});

const Category = mongoose.model('Category', categorySchema);

export default Category;
