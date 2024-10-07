import express from 'express';
import { getSubscribedChannels, getUserHistory, getUserLiveVideos, getUserVideos, isAddHistory, isdeleteUser, isDislikeUser, isgetUser, isLikeUser, isUpdateUser, toggleSubscription } from '../controller/User.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.get('/find/:id',isgetUser);
router.put('/like/:vidid',verifyToken,isLikeUser)
router.put('/dislike/:vidid',verifyToken,isDislikeUser)
router.put('/sub/:id',verifyToken,toggleSubscription)
router.put('/:id',verifyToken,isUpdateUser);
router.delete('/:id',verifyToken,isdeleteUser);
router.get('/video/:id',getUserVideos);
router.get('/live/:id',getUserLiveVideos);
router.get('/channels/:id',getSubscribedChannels);
router.post('/addhistory',verifyToken,isAddHistory);
router.get('/history',verifyToken,getUserHistory);


export default router