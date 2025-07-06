import mongoose from 'mongoose';

const OtpSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    isUsed: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

OtpSchema.index({ "expiresAt": 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('Otp', OtpSchema);