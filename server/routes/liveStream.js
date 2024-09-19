import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { getLiveStreams, startLiveStream, stopLiveStream } from '../controller/liveStream.js';

const router = express.Router();

router.post('/start', verifyToken, startLiveStream);
router.post('/stop', verifyToken, stopLiveStream);
router.get('/', getLiveStreams);

export default router;