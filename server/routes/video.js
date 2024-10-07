import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { addVideo, addView, deleteVideo, getByCategory, getBySearch, getByTags, getVideo, randomVideo, subscribedVideo, trendVideo, updateVideo } from '../controller/Video.js';

const router = express.Router();

router.get('/find/:id', getVideo)
router.get('/random', randomVideo)
router.get('/trend', trendVideo)
router.get('/tags', getByTags)
router.get('/search', getBySearch)
router.get('/sub', verifyToken, subscribedVideo)
router.post('/', verifyToken, addVideo)
router.put('/:id', verifyToken, updateVideo)
router.delete('/:id', verifyToken, deleteVideo)
router.put('/view/:id', addView)
router.get('/:category', getByCategory)

export default router