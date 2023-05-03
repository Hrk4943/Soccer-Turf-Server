import mongoose from "mongoose";

const connection = ()=>{
    mongoose.connect('mongodb+srv://soccerturf78:0000@cluster0.ho0vc9j.mongodb.net/?retryWrites=true&w=majority')
}
mongoose.set('strictQuery',true)

export default connection