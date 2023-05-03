import express from 'express'
const router =express.Router()
import {
    sendOtp,
    signUpAndOtpVerify,
    logIn,
    userCheck,
    resendOtp,
    forgotPassOtp,
    resetPassword,
    toViewTurf,
    toViewTurfs,
    bookingSlot,
    bookTurf,
    paymentProcess,
    bookingSuccess,
    userProfile,
    updateProfile,
    viewBookings,
    cancelBooking,
    wallet,
    } from '../Controllers/UserControllers.js'
import {userAuthentication} from '../Authentication/authentication.js'
import { jwtMiddleware } from '../Authentication/jwtMiddleware.js'

router.post('/getOtp',sendOtp)
router.post('/signup',signUpAndOtpVerify) 
router.post('/login',logIn)
router.post('/resendOtp',resendOtp)
router.post('/forgotPassword',forgotPassOtp)
router.post('/resetPassword',resetPassword)
router.get('/turfs',toViewTurfs)
router.get('/viewTurf/:id',toViewTurf)
router.get('/bookingslots/:date/:id',bookingSlot)
router.post('/booking',userAuthentication,bookTurf)
router.get('/payment/:id', paymentProcess);
router.post("/booking-success/:id", bookingSuccess);
router.get('/profile',userAuthentication,userProfile)
router.get('/bookingList',jwtMiddleware,viewBookings)
router.put('/profile',updateProfile)
router.post('/cancelBooking',jwtMiddleware,cancelBooking)
router.get('/wallet',jwtMiddleware,wallet)
router.get('/authenticate',userCheck)



export default router;