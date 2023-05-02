import mongoose from "mongoose";

const connection = ()=>{
    mongoose.connect('mongodb://localhost:27017/SoccerTurf11')
}
mongoose.set('strictQuery',true)

export default connection