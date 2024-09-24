import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { getAllActiveLiveStreams, getAllLiveStreams, getLiveStreamById, startLiveStream, stopLiveStream } from '../controller/liveStream.js';

const router = express.Router();

router.post('/start', verifyToken, startLiveStream);
router.post('/stop', verifyToken, stopLiveStream);
router.get('/', getAllLiveStreams);
router.get('/active', getAllActiveLiveStreams);
router.get('/:id',getLiveStreamById)

export default router;