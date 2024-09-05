import express from 'express';
import { isdeleteUser, isDislikeUser, isgetUser, isLikeUser, isSubscribeUser, isUnSubscribeUser, isUpdateUser } from '../controller/User.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.put('/:id',verifyToken,isUpdateUser);
router.delete('/:id',verifyToken,isdeleteUser);
router.get('/find/:id',isgetUser);
router.put('/sub/:id',verifyToken,isSubscribeUser)
router.put('/unsub/:id',verifyToken,isUnSubscribeUser)
router.put('/like/:vidid',verifyToken,isLikeUser)
router.put('/dislike/:vidid',verifyToken,isDislikeUser)

export default router