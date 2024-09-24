import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { getLiveStreamById, getLiveStreams, startLiveStream, stopLiveStream } from '../controller/liveStream.js';

const router = express.Router();

router.post('/start', verifyToken, startLiveStream);
router.post('/stop', verifyToken, stopLiveStream);
router.get('/', getLiveStreams);
router.get('/:id',getLiveStreamById)

export default router;