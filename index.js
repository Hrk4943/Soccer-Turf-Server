import express from "express"
import dotenv from 'dotenv'
import logger from 'morgan'
import cookieParser from "cookie-parser"
import bodyParser from "body-parser"
import cors from 'cors'
import passport from "passport"
// import passportSetup from "./Passport/Passport.js"
import cookieSession from "cookie-session"

import connection from "./Config/dbConnection.js"
import userRoute from "./Routes/User.js"
import turfRoute from "./Routes/Turf.js"
import adminRoute from './Routes/Admin.js'

const app = express()
dotenv.config()
connection()


app.use(
    cookieSession({
        name: "session",
        keys: ["openreplay"],
        maxAge: 24 * 60 * 60 * 100
    })
)

app.use(bodyParser.json({ limit: "50mb" }))
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }))
// app.use(express.json({limit:"50mb"}))
// app.use(express.urlencoded({limit:"50mb",extended:true}))
app.use(logger("dev"))
app.use(cookieParser())

app.use(passport.initialize())
app.use(passport.session())

// app.use(cors())
// app.use(
//     cors({
//         origin:"https://soccer-turf.netlify.app/",
//         methods: "GET,POST,PUT,DELETE,PATCH",
//         credentials:true,
//         allowedHeaders:[
//             'Content-type',
//             'Access',
//             'Authorization'
//         ]
//     })
// )
app.use(cors({
    origin: 'http://soccer-turf.netlify.app',
    methods:["GET","POST","PUT","DELETE","PATCH"],
    credentials:true,
    allowedHeaders:[
                    'Content-type',
                    'Access',
                    'Authorization'
                ]
}))



app.use("/", userRoute)
app.use("/turfOwner", turfRoute)
app.use('/admin', adminRoute)

app.listen("9000", () => {
    console.log("Server is Running Successfully At Port 9000")
})

