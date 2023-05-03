import express from 'express'
const router =express.Router()
import {
    turfRegistration,
    turfOtpSend,
    logIn,
    resendOtp,
    turfAuth,
    togetBooking,
    viewProfile,
    updateTurfProfile,
    totalCount,
} from '../Controllers/TurfController.js'
import { turfMiddleware } from '../Authentication/jwtMiddleware.js'


router.post('/turfOtp',turfOtpSend)
router.post('/turf-signUp',turfRegistration)
router.post('/login',logIn)
router.post('/resendOtp',resendOtp)
router.get('/authenticate',turfAuth)
router.get('/bookings',turfMiddleware,togetBooking)
router.get('/profile',turfMiddleware,viewProfile)
router.put('/updateProfile',turfMiddleware,updateTurfProfile)
router.get('/getCounts',turfMiddleware,totalCount)


export default router;