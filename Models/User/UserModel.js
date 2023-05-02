import mongoose from "mongoose"
const Schema=mongoose.Schema
const ObjectId= mongoose.Types.ObjectId

const userSchema=new Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    phone:{
        type:Number
    },
    wallet:{
        type:Number,
        default:0
    },
    block:{
        type:Boolean,
        default:false
    }
})

const userModel=mongoose.model('User',userSchema)
export default userModel