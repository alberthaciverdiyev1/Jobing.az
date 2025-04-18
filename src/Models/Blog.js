import mongoose from 'mongoose';

const { Schema } = mongoose;

const blogSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        unique: true
    },
    description: {
        type: String,
        required: false
    },
    imageUrl: {
        type: String,
        required: false
    },
    isActive: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    versionKey: false
});


const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
