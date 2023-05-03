import express from 'express'
const router = express.Router()
import {
    adminLogin,
    adminCheck,
    getUsers,
    blockUser,
    unblockUser,
    newRequestTurf,
    getTurfOwner,
    approveTurfOwner,
    rejectTurfOwner,
    blockTurfOwner,
    unblockTurfOwner,
    togetReports,
    totalCounts
} from '../Controllers/AdminController.js'
import { adminAuthentication } from '../Authentication/authentication.js'

router.post('/login',adminLogin)
router.get('/authenticate',adminCheck)
router.get('/getUsers',getUsers)
router.patch('/blockUser/:id',blockUser)
router.patch('/unblockUser/:id',unblockUser)
router.get('/newRequestTurf',newRequestTurf)
router.patch('/approveTurfRequest/:id',approveTurfOwner)
router.patch('/rejectTurf',rejectTurfOwner)
router.patch('/blockTurfOwner/:id',blockTurfOwner)
router.patch('/unblockTurfOwner/:id',unblockTurfOwner)
router.get('/getTurfOwner',getTurfOwner)
router.get('/booking',togetReports)
router.get('/getCounts',totalCounts)

export default router