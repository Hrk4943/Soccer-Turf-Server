import mongoose from 'mongoose'
const Schema=mongoose.Schema

const turfSchema=new Schema({
    name:{
        type:String,
        trim:true,
        required:true
    },
    courtName:{
        type:String,
        trim:true,
        required:true
    },
    email:{
        type:String,
        trim:true,
        unique:true,
        required:true
    },
    number:{
        type:String,
        required:true,
        trim:true,
        required:true
    },
    password:{
        type:String,
        trim:true,
        required:true
    },
    images:{
        type:Array,
        required:true
    },
    location:{
        type:String,
        trim:true,
        required:true
    },
    district:{
        type:String,
        required:true,
        trim:true,
    },
    state:{
        type:String,
        trim:true,
        required:true
    },
    sportsEvent:{
        type:String,
        trim:true,
        required:true
    },
    // images:{
    //     type:String,
    //     required:true 
    // },
    price:{
        type:Number,
        required:true,
    },
    enquiryNumber:{
        type:String
    },
    openingTime:{
        type:String
    },
    closingTime:{
        type:String
    },
    request:{
        type:Boolean,
        default:false
    },
    block:{
        type:Boolean,
        default:false
    },
    verification:{
        type:String,
        default:'Pending'
    },
},
{
    timestamps:true
}
)

const turfModel=mongoose.model('turfOwner',turfSchema)
export default turfModel