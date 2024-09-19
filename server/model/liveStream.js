import mongoose from 'mongoose';

const liveStreamSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isActive: { type: Boolean, default: true },
    videoUrl: { type: String},
    createdAt: { type: Date, default: Date.now }
});

const LiveStream = mongoose.model('LiveStream', liveStreamSchema);
export default LiveStream;
