import express from 'express';
import { isGoogleAuth, isSignIn, isSignUp } from '../controller/auth.js';
const router=express.Router();

router.post('/signin',isSignIn)
router.post('/signup',isSignUp)
router.post('/googleAuth',isGoogleAuth)

export default router