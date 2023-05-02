import jwt from 'jsonwebtoken'
import userModel from '../Models/User/UserModel.js'


export const jwtMiddleware = (req,res,next)=>{
    const token = req.headers.authorization
    if(token){
        const User = jwt.verify(token, process.env.TOKEN_SECRET)
        req.userId = User.userId
        next()
    }else{
        next()
    }
}
export const turfMiddleware=(req,res,next)=>{
    const token =req.headers.authorization
    if(token){
        const Turf=jwt.verify(token,process.env.TOKEN_SECRET)
        req.turfId = Turf.turfOwnerId
        next()
    }
    else{
        next()
    }
}

