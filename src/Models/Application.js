import mongoose from 'mongoose';

const { Schema } = mongoose;

const applicationSchema = new Schema({
    jobId: {
        type: Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    cvId: {
        type: Schema.Types.ObjectId,
        ref: 'CV',
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'interview'],
        default: 'pending'
    },
    companyId: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
        default: null
    },
    companyName: {
        type: String,
        default: ''
    },

    // Company/HR response (accept/reject with reason)
    companyResponse: {
        decision: {
            type: String,
            enum: ['accepted', 'rejected', null],
            default: null
        },
        reason: { type: String, default: '' },
        respondedAt: { type: Date, default: null },
        respondedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            default: null
        }
    },

    // User response to company decision
    userResponse: {
        message: { type: String, default: '' },
        respondedAt: { type: Date, default: null }
    },

    // Interview scheduling
    interview: {
        scheduledAt: { type: Date, default: null },
        duration: { type: Number, default: 30 },
        location: { type: String, default: '' },
        notes: { type: String, default: '' },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'cancelled', 'rescheduled'],
            default: 'pending'
        }
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

const Application = mongoose.model('Application', applicationSchema);
export default Application;
