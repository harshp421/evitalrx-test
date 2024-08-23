import dotenv from 'dotenv';
dotenv.config();



export const accessTokenExpireTime = parseInt(process.env.ACCESS_TOKEN_EXPIRE_TIME || '900', 10);
export const refreshTokenExpireTime = parseInt(process.env.REFRESH_TOKEN_EXPIRE_TIME || '2592000', 10);

//option for cookies
export const accessTokenOptions = {
    export: new Date(Date.now() + accessTokenExpireTime * 60 * 60 * 1000),
    maxAge: accessTokenExpireTime * 60 * 60 * 1000,
    sameSite: 'lax',
}
export const refreshTokenOption = {
    export: new Date(Date.now() + refreshTokenExpireTime * 24 * 60 * 60 * 1000),
    maxAge: refreshTokenExpireTime * 24 * 60 * 60 * 1000,
    sameSite: 'lax',
}

export const sendToken = (user, statusCode, res) => {
    const accessToken = user.getAccessToken();
    const refreshToken = user.getRefreshToken();


    //only set secure to true in production
    if (process.env.NODE_ENV === 'production') {
        accessTokenOptions.secure = true;
        refreshTokenOption.secure = true;
    }

     
    //send cookies
    res.cookie('access_token', accessToken, accessTokenOptions);
    res.cookie('refresh_token', refreshToken, refreshTokenOption);
    res.status(statusCode).json({
        success: true,
        message:'User logged in successfully',
        // user,
        // accessToken,
        // refreshToken
    });
}