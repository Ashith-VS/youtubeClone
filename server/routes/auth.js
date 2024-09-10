import express from 'express';
import { isGoogleAuth, isSignIn, isSignUp } from '../controller/auth.js';
const router = express.Router();

router.post('/signup', isSignUp)
router.post('/signin', isSignIn)
router.post('/googleAuth', isGoogleAuth)

export default router