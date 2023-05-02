import adminModel from "../Models/Admin/AdminModel.js";
import userModel from '../Models/User/UserModel.js'
import turfModel from '../Models/Turf/TurfModel.js'
import { generateToken } from '../Helpers/GenerateJWT.js'
import jwt from 'jsonwebtoken'
import nodeMailer from 'nodemailer'
import bcrypt from 'bcrypt'
import bookingModel from "../Models/Booking/BookingModel.js"


export const adminLogin = (req, res) => {
    try {
        let { email, password } = req.body
        adminModel.findOne({ email: email }).then(async (result) => {
            if (result) {
                const passwordCheck = await bcrypt.compare(password, result.password)
                if (passwordCheck) {
                    const token = generateToken({ adminId: result._id, email: email, type: 'admin' })
                    res.status(200).json({ token: token })
                } else {
                    res.status(404).json({ message: 'Invalid Password' })
                }
            } else {
                res.status(404).json({ message: "Invalid Email" })
            }
        })
    } catch (err) {
        res.status(404).json({ message: "Invalid Email or password" })
    }
}

export const adminCheck = (req, res) => {
    try {
        let token = req.headers.authorization
        jwt.verify(token, process.env.TOKEN_SECRET, (err, result) => {
            if (err) {
                res.status(401)
            } else {
                adminModel.findOne({ _id: result.adminId }).then((admin) => {
                    admin ? res.status(200).json({ status: true }) : res.status(401)
                })
            }
        })
    } catch (error) {
        res.status(500)
    }
}

export const getUsers = (req, res) => {
    try {
        userModel.find({}, { password: 0 }).then((users) => {
            res.status(200).json(users)
        })
    } catch (err) {
        res.status(500)
    }
}

export const blockUser = (req, res) => {
    try {
        const userId = req.params.id
        console.log(userId)
        userModel.updateOne(
            { _id: userId },
            { $set: { block: true } }
        ).then((result) => {
            result.acknowledged ? res.status(200).json({ status: true }) : res.status(500)
        })
    } catch (error) {
        res.status(500)
    }
}

export const unblockUser = (req, res) => {
    try {
        const userId = req.params.id
        userModel.updateOne(
            { _id: userId },
            { $set: { block: false } }
        ).then((result) => {
            result.acknowledged ? res.status(200).json({ status: true }) : res.status(500)
        })
    } catch (error) {
        res.status(500)
    }
}

export const getTurfOwner = (req, res) => {
    try {
        turfModel.find({ verification: 'Success' }, { password: 0 }).then((turfOwners) => {
            res.status(200).json(turfOwners)
        })
    } catch {
        res.status(500)
    }
}

export const newRequestTurf = (req, res) => {
    try {
        turfModel.find({ verification: 'Pending' }, { password: 0 }).then((result) => {
            res.status(200).json(result)
        })
    } catch (error) {
        res.status(500)
    }
}

export const approveTurfOwner = async (req, res) => {
    try {
        const turfOwnerId = req.params.id
        const turfOwner = await turfModel.findOne({ _id: turfOwnerId })
        if (turfOwner) {
            await turfModel.findOneAndUpdate(
                { _id: turfOwnerId },
                { $set: { verification: 'Success' } }
            )
            console.log("Mail Sending")
            const turfOwnerMail = turfOwner.email;
            const sender = nodeMailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                service: "Gmail",
                auth: {
                    user: "soccerturf78@gmail.com",
                    pass: process.env.MAIL_PASSWORD
                }
            })
            const mailOptions = {
                from: 'Soccer Turf',
                to: turfOwnerMail,
                subject: "Account Approved",
                text: `Your account have been Approved. As a verified Turf Owner, you can now add Turf and give the time available to play. Please familiarize yourself with the tools and features available. Contact us if you have any questions. Thank you for choosing to partner with us.`,
            }
            const turfOwners = await turfModel.find()
            sender.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    res.send({
                        success: true,
                        message: "Email send successfully",
                        data: turfOwners,
                    });
                }
            });
            res.send({
                success: true,
                message: 'Status Changed Successfully',
                data: turfOwners
            })
        } else {
            res.send({
                success: false,
                message: 'something went wrong'
            })
        }
        // turfModel.findByIdAndUpdate(
        //     {_id:turfOwnerId},
        //     {$set:{verification:'success'}}
        //     ).then((result)=>{
        //         result.acknowledged ? res.status(200).json({status:true}): res.status(500)
        //     })
    } catch (error) {
        res.status(500)
    }
}

export const rejectTurfOwner = async (req, res) => {
    try {
        const turfOwnerId = req.body.turfOwnerId
        const turfOwner = await turfModel.findOne({ _id: turfOwnerId })
        if (turfOwner) {
            await turfModel.findOneAndUpdate(
                { _id: turfOwnerId },
                { $set: { verification: 'Rejected' } }
            )
            console.log("Mail Sending")
            const turfOwnerMail = turfOwner.email;
            const sender = nodeMailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                service: "Gmail",
                auth: {
                    user: "soccerturf78@gmail.com",
                    pass: process.env.MAIL_PASSWORD
                }
            })
            const mailOptions = {
                from: 'Soccer Turf',
                to: turfOwnerMail,
                subject: "Account Rejected",
                text: `Your account have been Rejected. Please give correct details of your Turf.`,
            }
            const turfOwners = await turfModel.find()
            sender.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    res.send({
                        success: true,
                        message: "Email send successfully",
                        data: turfOwners,
                    });
                }
            });
            res.send({
                success: true,
                message: 'Status Changed Successfully',
                data: turfOwners
            })
        } else {
            res.send({
                success: false,
                message: 'something went wrong'
            })
        }
    } catch (error) {

    }
}

export const blockTurfOwner = (req, res) => {
    try {
        const turfOwnerId = req.params.id
        turfModel.updateOne(
            { _id: turfOwnerId },
            { $set: { block: true } }
        ).then((result) => {
            result.acknowledged ? res.status(200).json({ status: true }) : res.status(500)
        })
    } catch (error) {
        res.status(500)
    }
}

export const unblockTurfOwner = (req, res) => {
    try {
        const turfOwnerId = req.params.id
        turfModel.updateOne(
            { _id: turfOwnerId },
            { $set: { block: false } }
        ).then((result) => {
            result.acknowledged ? res.status(200).json({ status: true }) : res.status(500)
        })
    } catch (error) {
        res.status(500)
    }
}

export const togetReports = async (req, res) => {
    try {
        const bookings = await bookingModel.find({ payment: "Success" }).populate("turf", "courtName price");
        const salesReport = {};
        for (const booking of bookings) {
            const turfName = booking.turf.courtName;
            const totalPrice = booking.turf.price;
            const bookingCount = 1;
            if (!salesReport[turfName]) {
                salesReport[turfName] = {
                    totalBookings: bookingCount,
                    totalPrice: totalPrice,
                };
            } else {
                salesReport[turfName].totalBookings += bookingCount;
                salesReport[turfName].totalPrice += totalPrice;
            }
        }
        const dataArray = Object.entries(salesReport ).map(([name, { totalBookings, totalPrice }]) => ({ name, totalBookings, totalPrice }));

        console.log(dataArray);

        console.log(salesReport);

        res.status(200).json(dataArray)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const totalCounts=async(req,res)=>{
    try {
        const [userCounts,turfCounts,bookingCount]=await Promise.all([
            userModel.find().count(),
            turfModel.find({verification:"Success"}).count(),
            bookingModel.find({payment:"Success"}).count()
        ])
        console.log(userCounts,'/////')
        console.log(turfCounts,'..............')
        console.log(bookingCount,'000000')
        res.status(200).json({userCounts,turfCounts,bookingCount})
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
