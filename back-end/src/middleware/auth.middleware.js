import { updateAccessToken } from "../controller/user.controller.js";
import userModel from "../models/user.model.js";
import ErrorHandler from "../utils/errorHandler.js";
import { catchAsyncError } from "./catchAsyncError.js";
import jwt from 'jsonwebtoken';
export const isAuthenticated= catchAsyncError(async(req,res,next)=>{
   const access_token=req.cookies.access_token;

   if(!access_token){
       return next(new ErrorHandler('Please login to access this resource',401));
   }
    const decoded=jwt.verify(access_token,process.env.JWT_SECRET);

    if(!decoded){
        updateAccessToken(req,res,next);
        // return next(new ErrorHandler('Please login to access this resource',401));
    }
    const user=await userModel.findById(decoded.id);
    if(!user){
        return next(new ErrorHandler('User not found',401));
    }
    req.user=user;
    next();
})