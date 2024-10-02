import express from 'express';
import { isCurrentUser, isGoogleAuth, isSignIn, isSignUp } from '../controller/auth.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { logout, refreshAccessToken } from '../controller/RefreshToken.js';
const router = express.Router();

router.post('/signup', isSignUp)
router.post('/signin', isSignIn)
router.post('/googleAuth', isGoogleAuth)
router.get('/currentUser', verifyToken, isCurrentUser)
router.post('/refreshToken', refreshAccessToken)
router.post('/logout', logout)

export default router