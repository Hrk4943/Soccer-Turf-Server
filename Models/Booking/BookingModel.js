import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        turf: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "turfOwner",
            required: true
        },
        bookDate:
        {
            type: String,
            required: true
        },

        time: {
            type: String,
            required: true
        },
        payment: {
            type: String,
            required: true,
            default: 'Pending'
        },
        cancelBooking:{
            type:Boolean,
            default:false
        }
    },
    {
        timestamps: true
    }
)

const bookingModel = mongoose.model('bookings', bookingSchema)


export default bookingModel