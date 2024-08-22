import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
export const userServices = {

    createActivationToken: (user) => {
        const activationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const token = jwt.sign({ activationCode, user }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_TIME });
        return { activationCode, token };

    },
    getUserById: async (userId, res, next) => {
        const userJson = await userModel.findById(userId);
        if (!userJson) {
            return next(new ErrorHandler('User not found', 401));
        }

        res.status(200).json({
            success: true,
          userJson
        });



    }

}