import { Schema,model } from "mongoose";
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
dotenv.config(); 

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Please enter a username'],
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        min:[6, 'Password must be at least 6 characters long'],
        max: [20, 'Password must be at most 20 characters long'],
        select: false

    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [/^\d{10}$/, 'Please fill a valid mobile number']
    },
    dob: {
        type: Date,
        required: [true, 'Please enter your date of birth']
    },
     gender: {
        type: String,
        required: [true, 'Please select your gender'],
        enum:['male','female','other']
    },
    address: {
        type: String,
        required: true,
        max: [1024, 'Address must be at most 100 characters long']
    },
    role:{
        type: String,
        required: true,
        default: 'user',
        enum: ['user', 'admin']
    },
    isVarified:{
        type: Boolean,
        default: false
    },
    resetPasswordToken: String, // Add resetPasswordToken field
    resetPasswordExpire: Date, // Add resetPasswordExpire field
    
}, {
    timestamps: true
});

//hash the passwod before saving it to the database
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

//sign access token
userSchema.methods.getAccessToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_TOKEN_EXPIRES_TIME });
}

//sign refresh token
userSchema.methods.getRefreshToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES_TIME });
}

//compare user password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

// // Generate password reset token
// userSchema.methods.getResetPasswordToken = function () {
//     // Generate token
//     const resetToken = crypto.randomBytes(20).toString('hex');

//     // Hash and set to resetPasswordToken
//     this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

//     // Set token expire time
//     this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // Token valid for 10 minutes

//     return resetToken;
// }



const userModel= model('User', userSchema);

export default userModel;