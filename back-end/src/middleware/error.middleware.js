import ErrorHandler from "../utils/errorHandler.js";
export const ErrorMiddleware =(err,req,res,next)=>{

   err.statusCode=err.statusCode || 500;
   err.message=err.message || 'Internal Server Error';


   //wrong mongoose object id error
    if(err.name==='CastError'){
         const message=`Resource not found. Invalid: ${err.path}`;
         err=new ErrorHandler(message,400);
    }

    //duplicate key error
    if(err.code===11000){
        const message=`Duplicate ${Object.keys(err.keyValue)} entered`;
        err=new ErrorHandler(message,400);
    }

    //wrong jwt error
    if(err.name==='JsonWebTokenError'){
        const message='JSON Web Token is invalid. Try Again!!!';
        err=new ErrorHandler(message,400);
    }

    //jwt expired error
    if(err.name==='TokenExpiredError'){
        const message='JSON Web Token is expired. Try Again!!!';
        err=new ErrorHandler(message,400);
    }

    res.status(err.statusCode).json({
        success:false,
        error:err,
        message:err.message,
        stack:err.stack
    });
}