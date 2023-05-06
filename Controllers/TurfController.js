import turfModel from "../Models/Turf/TurfModel.js";
import bookingModel from "../Models/Booking/BookingModel.js"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { generateToken } from '../Helpers/GenerateJWT.js'
import sendMail from "../Helpers/NodeMail.js";
import otpGenerator from "../Helpers/OtpGenerator.js";
import cloudinary, { uploadMultipleImages } from '../Helpers/Cloudinary.js'


export const turfRegistration = async (req, res) => {
    try {
        let response = {}
        let turfOwner = req.body.turfData
        const otp = req.body.otp
        const image = req.body.image
        if (otp === otpVerify) {
            const response = await uploadMultipleImages(image)
            bcrypt.hash(turfOwner.password, 10).then((hash) => {
                turfOwner.password = hash
                turfOwner.images = response
                const newTurfOwner = new turfModel(turfOwner)
                newTurfOwner.save().then(() => {
                    response.signUp = true
                    res.status(200).json(response)
                })
            })
                .catch((error) => {
                    console.log(err, "here ereredfg");
                    console.log(error)
                })
        }
    } catch (err) {
        console.log(err, "here erere");
        res.status(500)
    }
}


export let otpVerify
export const turfOtpSend = async (req, res) => {
    try {
        let turfData = req.body
        let response = {}
        turfModel.findOne({ email: turfData.email }).then((turfOwner) => {
            if (turfOwner) {
                response.turfExist = true
                res.status(200).json(response)
            } else {
                otpGenerator().then((otp) => {
                    console.log(otp)
                    sendMail(turfData.email, otp).then((result) => {
                        if (result.otpSent) {
                            otpVerify = otp
                            console.log(otpVerify)
                            res.status(200).json(response)
                        } else {
                            res.status(500)
                        }
                    })
                })
            }
        })
    } catch (err) {
        res.status(500)
    }
}

export const logIn = (req, res) => {
    try {
        let response = {}
        const { email, password } = req.body
        turfModel.findOne({ email: email }).then((turfOwner) => {
            console.log(email)
            if (turfOwner) {
                if (!turfOwner.block) {
                    bcrypt.compare(password, turfOwner.password, (err, result) => {
                        if (result) {
                            console.log(result)
                            if (turfOwner.verification === 'Success') {
                                const token = generateToken({ turfOwnerId: turfOwner._id, turfOwnerName: turfOwner.name, type: 'turfOwner' })
                                response.token = token
                                response.status = "Success"
                                res.status(200).json(response)
                            } else if (turfOwner.verification === 'Pending') {
                                response.status = 'Pending'
                                res.status(200).json(response)
                            } else if (turfOwner.verification === 'Rejected') {
                                response.status = 'Rejected'
                                response.id = turfOwner._id
                                res.status(200).json(response)
                            }
                        } else if (err) {
                            res.status(500)
                        } else {
                            response.status = 'error'
                            res.status(200).json(response)
                        }
                    })
                } else {
                    console.log('blocked?');
                    response.status = 'block'
                    res.status(200).json(response)
                }
            } else {
                response.status = 'noUser'
                res.status(200).json(response)
            }
        })
    } catch (err) {
        res.status(500)
    }
}

export const resendOtp = (req, res) => {
    try {
        let response = {}
        let email = req.body.email
        otpGenerator().then((otp) => {
            otpVerify = otp
            sendMail(email, otp).then((result) => {
                console.log(otp)
                if (result.otpSent) {
                    response.otpSent = true
                    res.status(200).json(response)
                } else {
                    res.status(500)
                }
            })
        })
    } catch (error) {
        res.status(500)
    }
}

export const turfAuth = (req, res) => {
    let token = req.headers.authorization
    try {
        if (token) {
            jwt.verify(token, process.env.TOKEN_SECRET, async (err, result) => {
                if (!err) {
                    let user = await turfModel.findOne({ _id: result.turfOwnerId })
                    if (user) {
                        if (!user.block) {
                            res.status(200).json({ authorization: true })
                        } else {
                            res.status(401).json({ authorization: false })
                        }
                    } else {
                        res.status(401).json({ authorization: false })
                    }
                } else {
                    res.status(401).json({ authorization: false })
                }
            })
        } else {
            res.status(401).json({ authorization: false })
        }
    }
    catch (err) {
        res.status(500)
    }

}


// export const togetBooking = async (req, res) => {
//     try {
//         const token = req.headers.authorization
//         const jwtToken = jwt.verify(token, process.env.TOKEN_SECRET)
//         const turfOwnerId = jwtToken.turfOwnerId
//         if (!turfOwnerId) return res.status(404).json({ message: "invalid" });
//         const bookings = await bookingModel.find({ turf: turfOwnerId }).populate("user");
//         res.status(200).json({ bookingDetails: { bookings } });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json(error?.response?.data);
//     }
// };


export const togetBooking = async (req, res) => {
    try {
        const turfId = req.turfId
        if (!turfId) return res.status(404).json({ message: "invalid" });
        const bookings = await bookingModel.find({ turf: turfId }).populate('user')
        res.status(200).json(bookings);
    } catch (error) {
        console.log(error);
        res.status(500).json(error?.response?.data);
    }
}


export const viewProfile = async (req, res) => {
    try {
        const turfOwnerId = req.turfId
        const turf = await turfModel.findOne({ _id: turfOwnerId });
        res.status(200).json({ turf });
    } catch (error) {
        console.log(error);
        res.status(500).json(error?.response?.data?.message);
    }
};


export const updateTurfProfile=async(req,res)=>{
    try {
        const{
            _id,
    //   courtName,
      email,
      disrict,
      state,
      location,
      number,
      closingTime,
      openingTime,
      price,  
        }=req.body.data;
        const image = req.body.image
        const response = await uploadMultipleImages(image)
        const updateDataturf = await turfModel.findByIdAndUpdate(_id, {
            disrict:disrict,
            state:state,
            email:email,
            location:location,
            number: number,
            openingTime: openingTime.toString(),
            closingTime: closingTime.toString(),
            price: price.toString(),
            images:response
          });
          res.status(200).json({ message: "Update successfully" })
    } catch (error) {
        console.log(error);
     res.status(500).json(error?.response?.data?.message);
    }
}


// export const updateTurfProfile = async (req, res) => {
//     try {
//         const turfOwnerId = req.body.data._id
//         const updateData = req.body.data
//         console.log(updateData,'//////')
//         const image = req.body.image
//         const response = await uploadMultipleImages(image)
//         const updatedTurfOwner = { _id: turfOwnerId, images: response }
//         const updateTurf = await turfModel.updateOne({ _id: turfOwnerId }, updatedTurfOwner)
//         res.status(200).json({ message: "Update successfully" })
//     } catch (error) {
//         console.log(error);
//         res.status(500).json(error?.response?.data?.message);
//     }
// };


export const totalCount = async (req, res) => {
    try {
        const turf = req.turfId
        const Turf = await turfModel.findOne({ turf })
        if (!Turf) return res.status(400).json({ message: "No Turfs Found " })
        const turfId = Turf?._id
        const bookingCount = await bookingModel.findOne({ turf, payment: "Success" }).count()
        console.log(turf);
        const dayWiseBookings = await bookingModel.aggregate([
            {
                $match: { payment:"Success"}
            },
            {
                $group: {
                    // _id: "$bookDate",
                    _id: { turf: "$turf", bookDate: "$bookDate" },
                    count: { $sum: 1 },
                    
                },
            },
            // {$project:{turf:1,_id:0}},
            {
                $sort: { bookDate: 1 },
            },
        ]);
        console.log(dayWiseBookings,"bbbb");
        const filterData = dayWiseBookings.filter((item) => {
            return item._id.turf == turf
        }).map((item) => {
           
            const date = new Date(item._id.bookDate);
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear().toString();

            return {
                date: `${day}-${month}-${year}`,
                count: item.count
            };
        });
       
        const userCount = await bookingModel.find({ turfId }).distinct('user')
        
        res.status(200).json({ dayWiseBookings: filterData, userCount: userCount?.length, bookingCount })
    } catch (error) {
        res.status(500).json(error?.response?.data)
    }
}

