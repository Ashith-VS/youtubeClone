import express from 'express';
import { isCurrentUser, isGoogleAuth, isSignIn, isSignUp, logout, refreshAccessToken } from '../controller/auth.js';
import { verifyToken } from '../middleware/verifyToken.js';
const router = express.Router();

router.post('/signup', isSignUp)
router.post('/signin', isSignIn)
router.post('/googleAuth', isGoogleAuth)
router.get('/currentUser', verifyToken, isCurrentUser)
router.get('/refreshToken', refreshAccessToken)
router.post('/logout', logout)

export default router