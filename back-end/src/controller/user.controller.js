import { catchAsyncError } from "../middleware/catchAsyncError.js";
import userModel from "../models/user.model.js";
import { userServices } from "../services/user.services.js";
import ErrorHandler from "../utils/errorHandler.js";
import { accessTokenOptions, refreshTokenOption, sendToken } from "../utils/jwt.js";
import sendMail from "../utils/sendMail.js";
import ejs from 'ejs'
import path from 'path';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const registerUser = catchAsyncError(async (req, res, next) => {
    try {
        const { username, email, password, mobile, dob, gender, address } = req.body;

        // check if the user already exist 
        const isEmailAlready = await userModel.findOne({ email });
        if (isEmailAlready) {
            return next(new ErrorHandler('User already exist with this email', 400));
        }

        const user = {
            username,
            email,
            password,
            mobile,
            dob,
            gender,
            address
        }

        //create activation token  and opt for email verification
        const activationToken = userServices.createActivationToken(user);
        const activationCode = activationToken.activationCode;
        const data = { user: { name: user.name }, activationCode };
        const html = ejs.renderFile(path.join(__dirname, '../mails/activation-mail.ejs'), data);

        try {
            await sendMail({
                email,
                subject: 'Account Activation',
                template: 'activation-mail.ejs',
                data
            });
            res.status(200).json({
                success: true,
                message: `Please check your email to activate your account. Activation code is sent to your email ${user.email}`,
                activationToken: activationToken.token
            });
        } catch (err) {
            console.log(err, "emailerror");
            return next(new ErrorHandler(err.message, 400));
        }


    } catch (err) {
        console.log(err, "error");
        return next(new ErrorHandler(err.message, 400));
    }

})

export const activateAccount = catchAsyncError(async (req, res, next) => {

    try {
        const { activationCode, activationToken } = req.body;
        if (!activationCode) {
            return next(new ErrorHandler('Please enter the activation code', 400));
        }
        const decoded = jwt.verify(activationToken, process.env.JWT_SECRET);
        if (decoded.activationCode !== activationCode) {
            return next(new ErrorHandler('Invalid activation code', 400));
        }
        const existingUser = await userModel.findOne({ email: decoded.user.email });
        if (existingUser) {
            return next(new ErrorHandler('User already exist with this email', 400));
        }
        const { username, email, password, mobile, dob, gender, address } = decoded.user;
        const user = await userModel.create({
            username,
            email,
            password,
            mobile,
            dob,
            gender,
            address
        });
        user.isVarified = true;
        await user.save({ validateBeforeSave: false });
        res.status(200).json({
            success: true,
            message: 'Account is activated successfully'
        });


    } catch (error) {
        console.log(error, "error");
        return next(new ErrorHandler(error.message, 400));
    }

})

export const login = catchAsyncError(async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new ErrorHandler('Please enter email and password', 400));
        }
        const user = await userModel.findOne({ email }).select('+password');
        if (!user) {
            return next(new ErrorHandler('Invalid email or password', 400));
        }
        const isPasswordMatched = await user.comparePassword(password);
        if (!isPasswordMatched) {
            return next(new ErrorHandler('Invalid email or password', 400));
        }

        sendToken(user, 200, res);

    } catch (error) {
        console.log(error, "error");
        return next(new ErrorHandler(error.message, 400));
    }

})


// get user info => /api/v1/me
export const getUserinfo = catchAsyncError(async (req, res, next) => {


    try {
        const userId = req.user._id;
        await userServices.getUserById(userId, res, next);
    } catch (err) {
        return next(new ErrorHandler(err.message, 400));
    }


});

//update user profile => /api/v1/me/update
export const updateProfile = catchAsyncError(async (req, res, next) => {
    try {
        const newUserData = {
            username: req.body.username,
            dob: req.body.dob,
            gender: req.body.gender,
            address: req.body.address
        };

        // Find user by ID and update
        const user = await userModel.findByIdAndUpdate(req.user.id, newUserData, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        });

        if (!user) {
            return next(new ErrorHandler('User not found', 404));
        }

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user
        });
    } catch (err) {
        return next(new ErrorHandler(err.message, 400));
    }
});



// forget password 
export const forgotPassword = catchAsyncError(async (req, res, next) => {
    const user = await userModel.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler('User not found with this email', 404));
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash and set resetPasswordToken and resetPasswordExpire
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // Token valid for 10 minutes

    await user.save({ validateBeforeSave: false });
  
    
    // Create reset password URL
    const resetUrl = `${req.protocol}://${req.get('host')}/forget-password/${resetToken}`;
  //  console.log(resetUrl, "user");
    const data = { username: user.username, resetUrl: resetUrl };
    try {
        await sendMail({
            email: user.email,
            subject: 'Password Reset',
            template: 'password-reset-email.ejs',
            data
        });

        res.status(200).json({
            success: true,
            message: `Email sent to: ${user.email}`
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
       console.log(error, "error");
        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler('Email could not be sent', 500));
    }
});


// Reset password   =>  /api/v1/password/reset/:token
// Reset Password => /api/v1/password/reset/:token
export const resetPassword = catchAsyncError(async (req, res, next) => {
    // Hash URL token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await userModel.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        return next(new ErrorHandler('Password reset token is invalid or has expired', 400));
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler('Password does not match', 400));
    }

    // Set new password
    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
        success: true,
        message: 'Password updated successfully'
    });
});
// logout user 
export const logoutUser = catchAsyncError(async (req, res, next) => {
    try {
        res.cookie('access_token', 'none', {
            maxAge: 1
        });
        res.cookie('refresh_token', 'none', {
            maxAge: 1
        });
        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });

    } catch (err) {
        return next(new ErrorHandler(err.message, 400));
    }
});




//update access token => /api/v1/refresh
export const updateAccessToken = catchAsyncError(async (req, res, next) => {
    try {

        const refresh_token = req.cookies.refresh_token;
        if (!refresh_token) {
            return next(new ErrorHandler('Please login to access this resource', 401));
        }
        const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN);
        if (!decoded) {
            return next(new ErrorHandler('Please login to access this resource', 401));
        }

        const session = await userModel.findById(decoded.id);
        if (!session) {
            return next(new ErrorHandler('Please login to access this resource', 401));
        }
        const user = JSON.parse(session);
        const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN || " ", { expiresIn: "1d" });
        const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN || " ", { expiresIn: "7d" });

        req.user = user;
        res.cookie('access_token', accessToken, accessTokenOptions);
        res.cookie('refresh_token', refreshToken, refreshTokenOption);
        next();
    } catch (err) {
        return next(new ErrorHandler(err.message, 400));
    }
});