import express from 'express';
const router = express.Router();

import authRoutes from "./auth.js"
import userRoutes from "./user.js"
import videoRoutes from "./video.js"
// import commentRoutes from "./comment"

router.use('/api/auth',authRoutes)
router.use('/api/users',userRoutes)
router.use('/api/video',videoRoutes)
// router.use('/api/comment',commentRoutes)

export default router;
