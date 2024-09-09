import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { addComment, deleteComment, getAllComments } from '../controller/Comment.js';
const router = express.Router();

router.post('/',verifyToken,addComment)
router.delete('/:id',verifyToken,deleteComment)
router.get('/:videoId',verifyToken,getAllComments)

export default router;