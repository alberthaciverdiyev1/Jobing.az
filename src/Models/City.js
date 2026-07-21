import mongoose from 'mongoose';

const { Schema } = mongoose;

const citySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    website: {
        type: String,
        required: false
    },
    cityId: {
        type: Number,
        required: false
    }
}, {
    timestamps: true,
    versionKey: false
});

citySchema.index({ website: 1 });

const City = mongoose.model('City', citySchema);

export default City;
