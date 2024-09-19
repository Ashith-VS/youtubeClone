import express from 'express';
const router = express.Router();

import authRoutes from "./auth.js"
import userRoutes from "./user.js"
import videoRoutes from "./video.js"
import commentRoutes from "./comment.js"
import liveStreamRoutes from "./liveStream.js"

router.use('/api/auth',authRoutes)
router.use('/api/user',userRoutes)
router.use('/api/video',videoRoutes)
router.use('/api/comment',commentRoutes)
router.use('/api/live',liveStreamRoutes)

export default router;
