import mongoose from 'mongoose';

const { Schema } = mongoose;

const categorySchema = new Schema({
    localCategoryId: {
        type: Number,
        required: true
    },
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
    }
}, { 
    timestamps: true,
    versionKey: false
});

categorySchema.virtual('Parent', {
    ref: 'Category',
    localField: 'parentId',
    foreignField: 'id',
    justOne: true
});

const Category = mongoose.model('Category', categorySchema);

export default Category;
