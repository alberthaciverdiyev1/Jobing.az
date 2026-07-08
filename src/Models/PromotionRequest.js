import mongoose from 'mongoose';

const { Schema } = mongoose;

const promotionRequestSchema = new Schema({
    jobId: {
        type: Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    planId: {
        type: Schema.Types.ObjectId,
        ref: 'PricingPlan',
        required: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});

const PromotionRequest = mongoose.model('PromotionRequest', promotionRequestSchema);

export default PromotionRequest;
