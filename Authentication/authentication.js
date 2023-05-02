import userModel from '../Models/User/UserModel.js'
import adminModel from '../Models/Admin/AdminModel.js'
import jwt from 'jsonwebtoken'
import turfModel from '../Models/Turf/TurfModel.js'


export const userAuthentication = (req,res,next)=>{
    if(req.headers.authorization){
        let token = req.headers.authorization
        jwt.verify(token, process.env.TOKEN_SECRET,(err,result)=>{
            if(err){
                res.status(401).json({authorization:false})
            }else{
                userModel.findOne({_id:result.userId}).then((user)=>{
                    if(user){
                        if(user.block){
                            res.status(401).json({authorization:false})
                        }else{
                            req.userLogged = result.userId
                            next()
                        }
                    }else{
                        res.status(401).json({authorization:false})
                    }

                }).catch((err)=>res.status(401).json({authorization:false}))
            }  
        })
    }else{
        res.status(401).json({authorization:false})
    }
}

export const turfAuthentication = (req,res,next)=>{
    if(req.headers.authorization){
        let token = req.headers.authorization
        jwt.verify(token, process.env.TOKEN_SECRET,(err,result)=>{
            console.log(result,'99999999')
            if(err){
                res.status(401).json({authorization:false})
            }else{
                turfModel.findOne({_id:result.turfId}).then((turfOwner)=>{
                    if(turf){
                        if(turf.block){
                            res.status(401).json({authorization:false})
                        }else{
                            req.turfLogged = result.turfId
                            next()
                        }
                    }else{
                        res.status(401).json({authorization:false})
                    }

                }).catch((err)=>res.status(401).json({authorization:false}))
            }  
        })
    }
    else{
        res.status(401).json({authorization:false})
    }
}



export const adminAuthentication = (req,res,next)=>{
    // if(req.headers.authorization){

    try {
        let token = req.headers.authorization
        jwt.verify(token, process.env.TOKEN_SECRET,(err,result)=>{
            if(err){
                res.status(401).json({authorization:false})
            }else{
                adminModel.findOne({_id:result.adminId}).then((admin)=>{
                    if(admin){
                        next()
                    }else{
                        console.log('11111111111111111111111')
                        res.status(401).json({authorization:false})
                    }

                }).catch((err)=>res.status(401).json({authorization:false}))
            }  
        })
    } catch (error) {
        console.log(error)
    }
        



    // }else{
    //     console.log('333333333333333333333333333')
    //     res.status(401).json({authorization:false})
    // }
}