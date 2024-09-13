import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { addComment, deleteComment, getAllComments } from '../controller/Comment.js';
const router = express.Router();

router.get('/:videoId', getAllComments)
router.post('/', verifyToken, addComment)
router.delete('/:id', verifyToken, deleteComment)

export default router;