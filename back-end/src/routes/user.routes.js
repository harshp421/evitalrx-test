import express from 'express';
import { activateAccount, forgotPassword, getUserinfo, login, logoutUser, registerUser, resetPassword, updateAccessToken, updateProfile } from '../controller/user.controller.js';
import { isAuthenticated } from '../middleware/auth.middleware.js';

const userRouter = express.Router();


userRouter.post('/register',registerUser );

userRouter.post('/activate', activateAccount);

userRouter.post('/login', login);

userRouter.get('/profile', isAuthenticated, getUserinfo);

userRouter.put('/update-profile', isAuthenticated,updateProfile );

userRouter.get('/refresh_token',updateAccessToken);

// Forget Password
userRouter.post('/forgot-password', forgotPassword);

// Reset Password
userRouter.put('/reset-password/:token', resetPassword);

userRouter.get('/logout',isAuthenticated, logoutUser);



export default userRouter;