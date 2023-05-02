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
router.get('/blockUser/:id',blockUser)
router.get('/unblockUser/:id',unblockUser)
router.get('/newRequestTurf',newRequestTurf)
router.post('/approveTurfRequest/:id',approveTurfOwner)
router.post('/rejectTurf',rejectTurfOwner)
router.get('/blockTurfOwner/:id',blockTurfOwner)
router.get('/unblockTurfOwner/:id',unblockTurfOwner)
router.get('/getTurfOwner',getTurfOwner)
router.get('/booking',togetReports)
router.get('/getCounts',totalCounts)

export default router