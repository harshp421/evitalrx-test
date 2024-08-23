
import axiosInstance from "../axios.config"

export const userService={
    login:async (data:any)=>{
       return await axiosInstance.post('/user/login',data, { withCredentials: true })
    },
    logOut:async ()=>{
        return await axiosInstance.get('/user/logout', { withCredentials: true })
    },
    register:async (data:any)=>{
        return await axiosInstance.post('/user/register',data, { withCredentials: true })
    },
    verifyOtp:async (data:any)=>{
        return await axiosInstance.post('/user/activate',data, { withCredentials: true })
    },
    forgetPassword:async (data:any)=>{
        return await axiosInstance.post('/user/forgot-password',data, { withCredentials: true })
    },
    resetPassword:async (data:any,token:any)=>{
        return await axiosInstance.put(`/user/reset-password/${token['reset-token']}`,data, { withCredentials: true })
    },
    getUser:async ()=>{
        return await axiosInstance.get('/user', { withCredentials: true })
    },
    updateUser:async (data:any)=>{
        return await axiosInstance.put('/user/update-profile',data, { withCredentials: true })
    },

}