import bcrypt from 'bcrypt'
import userModel from '../Models/User/UserModel.js'
import { generateToken } from '../Helpers/GenerateJWT.js'
import otpGenerator from '../Helpers/OtpGenerator.js'
import sendMail from '../Helpers/NodeMail.js'
import turfModel from '../Models/Turf/TurfModel.js'
import jwt from 'jsonwebtoken'
import bookingModel from '../Models/Booking/BookingModel.js'
import { paymentStripe } from '../Helpers/Stripe.js'
import e from 'express'

export let otpVerify

//SignUp with OTP verification
export const signUpAndOtpVerify = (req, res) => {
    try {
        const user = req.body.userData
        console.log(user)
        const otp = req.body.otp
        let response = {}
        if (otp === otpVerify) {
            bcrypt.hash(user.password, 10).then((hash) => {
                user.password = hash
                const newUser = new userModel(user)
                newUser.save().then(() => {
                    response.status = true
                    res.status(200).json(response)
                })
            })
        } else {
            response.status = false
            res.status(200).json(response)
        }
    } catch (err) {
        res.status(500)
    }
}

//OTP Send

export const sendOtp = (req, res) => {
    try {
        let userData = req.body
        let response = {}
        userModel.findOne({ email: userData.email }).then((user) => {
            if (user) {
                response.userExist = true
                res.status(200).json(response)
            } else {
                otpGenerator().then((otp) => {
                    sendMail(userData.email, otp).then((result) => {
                        if (result.otpSent) {
                            otpVerify = otp
                            console.log(otp)
                            res.status(200).json(response)
                        } else {
                            res.status(500)
                        }
                    })
                })
            }
        })

    } catch (err) {
        res.status(500).json(err)
    }
}


//Login
export const logIn = (req, res) => {
    try {
        let response = {}
        let { email, password } = req.body
        userModel.findOne({ email: email }).then((user) => {
            if (user) {
                if (!user.block) {
                    bcrypt.compare(password, user.password, function (err, result) {
                        if (result) {
                            const token = generateToken({ userId: user._id, name: user.name, type: 'user' })
                            response.token = token
                            response.logIn = true
                            res.status(200).json(response)
                        } else {
                            response.incPass = true
                            res.status(200).json(response)
                        }
                    })
                } else {
                    response.block = true
                    res.status(200).json(response)
                }
            } else {
                response.noUser = true
                res.status(200).json(response)
            }
        })
    } catch (err) {
        res.status(500)
    }
}

export const userCheck = (req, res) => {
    let token = req.headers?.authorization
    try {
        if (token) {
            jwt.verify(token, process.env.TOKEN_SECRET, (err, result) => {
                if (err) {
                    res.status(401).json({ authorization: false })
                } else {
                    userModel.findOne({ _id: result.userId }).then((user) => {
                        if (user) {
                            if (!user.block) {
                                res.status(200).json({ authorization: true })
                            } else {
                                res.status(401).json({ authorization: false })
                            }
                        } else {
                            res.status(401).json({ authorization: false })
                        }
                    })
                }
            })
        } else {
            res.status(401).json({ authorization: false })
        }
    } catch (err) {
        res.status(401).json({ authorization: false })
    }
}

export const resendOtp = (req, res) => {
    try {
        let email = req.body.email
        let response = {}
        otpGenerator().then((otp) => {
            otpVerify = otp
            sendMail(email, otp).then((result) => {
                if (result.otpSent) {
                    console.log(otp, "resend")
                    response.status = true
                    res.status(200).json(response)
                } else {
                    response.status = false
                    res.status(200).json(response)
                }
            })
        })
    } catch (error) {
        res.status(500)
    }
}

export const forgotPassOtp = (req, res) => {
    try {
        let email = req.body.email
        let response = {}
        userModel.findOne({ email: email }).then((user) => {
            if (user) {
                otpGenerator().then((otp) => {
                    otpVerify = otp
                    sendMail(email, otp).then((result) => {
                        if (result.otpSent) {
                            console.log(otp)
                            response.otpSent = true
                            res.status(200).json(response)
                        } else {
                            res.status(200).json(response)
                        }
                    })
                })
            } else {
                response.userErr = true
                res.status(200).json(response)
            }
        })
    } catch (error) {
        res.status(500)
    }
}

export const resetPassword = (req, res) => {
    try {
        const { otp, email, password } = req.body
        console.log(otp)
        if (otp === otpVerify) {
            bcrypt.hash(password, 10).then((hash) => {
                userModel.findOneAndUpdate({ email: email }, { $set: { password: hash } }).then((result) => {
                    res.status(200).json({ reset: true })
                })
            })
        } else {
            res.status(200).json({ reset: false })
        }
    } catch (error) {
        res.status(500)
    }
}

export const toViewTurfs = async (req, res) => {
    try {
        const turfs = await turfModel.find({ verification: 'Success' });
        res.status(200).json({ turfs });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "server error" });
    }
};


export const toViewTurf = async (req, res) => {
    try {
        const ID = req.params.id;
        const turf = await turfModel.findById({ _id: ID });
        res.status(200).json({ turf });
    } catch (error) {
        console.log(error);
        res.status(500)
    }
};

export const bookingSlot = async (req, res) => {
    const ID = req.params.id
    let date = req.params.date
    const bookDate = new Date(date)
    bookDate.setHours(0);
    bookDate.setMinutes(0);
    bookDate.setSeconds(0);
    bookDate.setMilliseconds(0);
    try {
        const booking = await bookingModel.find({ turf: ID, bookDate })
        return res.status(200).json(booking)
    } catch (error) {
        console.log(error)
        res.status(500)
    }
}

export const bookTurf = async (req, res) => {
    try {
        let token = req.headers.authorization
        const key = jwt.verify(token, process.env.TOKEN_SECRET)
        const { ID, date, time } = req.body;
        const turf = await turfModel.findById({ _id: ID });
        const price = turf?.price;
        const userId = key.userId;
        const bookDate = new Date(date);
        bookDate.setHours(0);
        bookDate.setMinutes(0);
        bookDate.setSeconds(0);
        bookDate.setMilliseconds(0);
        const newBooking = await bookingModel.create({
            user: userId,
            turf: ID,
            bookDate,
            time,
            price,
        });
        res.status(200).json(newBooking);
    } catch (error) {
        console.log(error);
        res.status(500)
    }
}


export const paymentProcess = async (req, res) => {
    try {
        const bookingId = req.params.id;
        const result = await bookingModel
            .findById(bookingId)
            .populate("user")
            .populate("turf");
        const response = await paymentStripe(
            result?.turf.price,
            result?.turf.courtName,
            result?.user.email,
            bookingId
        );
        res.status(200).json({ response });
    } catch (error) {
        console.log(error);
        res.status(500).json(error?.response?.data?.message);
    }
};

export const bookingSuccess = async (req, res) => {
    const ID = req.params.id;
    try {
        const result = await bookingModel
            .findById(ID)
            .populate("user")
            .populate("turf");
        if (result) {
            await bookingModel.findByIdAndUpdate(ID, { payment: "Success" });
            res.status(200).json(result);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json(error?.response?.data);
    }
};

export const userProfile = async (req, res) => {
    try {
        let token = req.headers.authorization
        const key = jwt.verify(token, process.env.TOKEN_SECRET)
        const ID = key.userId
        console.log(ID)
        const user = await userModel.findById(ID, { __v: 0 })
        if (!user) {
            res.status(401).json({ message: 'User Not Found' })
        } else {
            res.status(200).json(user)
        }
    } catch (error) {
        console.log(error)
        res.status(500).json(error?.response?.data)
    }
}

export const updateProfile = async (req, res) => {
    try {
        let token = req.headers.authorization;
        const key = jwt.verify(token, process.env.TOKEN_SECRET);
        const ID = key.userId;
        const { name, email, phone } = req.body.users || {};
        if (!name || !email || !phone) {
            res.status(401).json({ message: "Data Not Found" });
        }
        const updatedUser = await userModel.findByIdAndUpdate(
            { _id: ID },
            { name, email, phone },
            { new: true }
        );
        if (!updatedUser) {
            res.status(401).json({ message: "User Not Found" });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        console.log(error);
        res.status(500).json(error?.response?.data);
    }
};


export const viewBookings = async (req, res) => {
    try {
        const date = new Date()
        const user = req.userId;
        // const user=req.user.id
        const bookings = await bookingModel.find({ user, payment: { $ne: "Pending" } }).populate("turf")
        const UpcomingBookings = await bookingModel.find({ user, bookDate: { $gte: date } }).populate('turf')
        res.status(200).json(bookings)
    } catch (error) {
        console.log(error)
        res.status(500).json(error?.response?.data)
    }
}

export const cancelBooking = async (req, res) => {
    try {
        const userID = req.userId
        const bookingId = req.body.bookingId
        const book = await bookingModel.findOne({ _id: bookingId }).populate("turf")
        const price = book.turf.price
        const refundMoney = await userModel.findByIdAndUpdate({ _id: userID }, { $inc: { wallet: price } }, { new: true })
        if (refundMoney) {
            const cancelled = await bookingModel.findByIdAndUpdate(bookingId, { $set: { payment: "Cancelled" } }, { new: true })
            res.status(200).json({ message: "Booking cancelled And money Refunded to Your Wallet" })
        } else {
            res.status(404).json({ message: "Unable to refund money" })
        }
    } catch (error) {
        res.status(500).json({ message: "internal server error" })
    }
}

export const wallet = async (req, res) => {
    try {
        const user = req.userId
        const userData = await userModel.findOne({ _id: user })
        const wallet = userData.wallet
        res.status(200).json(wallet)
    } catch (error) {
        res.status(500).json(error?.response?.data)
    }
}

export const reviewSubmit = async (req, res) => {
    try {
        const { id, name, review, rating } = req.body;
        console.log(req.body)
        const turf = await turfModel.findById({ _id: id });
        const newReview = {
            name,
            review,
            rating,
        };
        turf.reviews.push(newReview);
        const ratings = turf.reviews.map((review) => review.rating);
        const averageRating = ratings.reduce((a, b) => a + b) / ratings.length;
        turf.rating = averageRating;
        await turf.save();
        res.status(200).json(turf);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}

export const getReviews = async (req, res) => {
    try {
        console.log("firstfirstfirstfirst")
        const turfId = req.params.id
        console.log(turfId, '///////')
        const reviews = await turfModel.findById({ _id: turfId })
        res.status(200).json({ reviews:reviews.reviews.reverse() })
    } catch (error) {
        console.log(error);
        res.status(500)
    }
}
