import mongoose from 'mongoose';

const { Schema } = mongoose;

const pricingPlanSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['premium', 'promote'],
        required: true
    },
    duration: {
        type: String,
        enum: ['daily', 'monthly'],
        required: true
    },
    description: {
        type: String,
        default: '',
        trim: true
    },
    features: [{
        type: String,
        trim: true
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});

const PricingPlan = mongoose.model('PricingPlan', pricingPlanSchema);

export default PricingPlan;
