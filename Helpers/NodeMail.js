import nodeMailer from 'nodemailer'

const sendMail=(email,otp)=>{
    let response={
        otpSent:true
    }
    return new Promise((resolve,reject)=>{
        let transporter=nodeMailer.createTransport({
            host:"smtp.gmail.com",
            port:465,
            secure:true,
            service:"Gmail",
            auth:{
                user:"soccerturf78@gmail.com",  
                pass:process.env.MAIL_PASSWORD
            }
        })
        var mailOptions={
            to: email,
            subject: "OTP for Registration",
            html: "<!DOCTYPE html><html><head><title>OTP for Registration</title><meta charset='utf-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'></head><body style='background-color: #f5f5f5; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.5; color: #333;'><div style='max-width: 600px; margin: 0 auto; padding: 20px;'><div style='background-color: #fff; border-radius: 10px; padding: 30px; box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);'><h2 style='color: #333; margin-bottom: 30px;'>OTP for Account Verification</h2><p style='font-size: 18px; line-height: 1.5;'>Dear user,</p><p style='font-size: 18px; line-height: 1.5;'>Your OTP for registration is:</p><h1 style='font-weight: bold; font-size: 40px; margin-bottom: 30px; color: #ff6600;'>" + otp + "</h1><p style='font-size: 18px; line-height: 1.5;'>Please enter this OTP on the registration page to complete your account verification.</p><p style='font-size: 18px; line-height: 1.5;'>Thank you for choosing SoccerTurf.</p></div></div></body></html>"
        }
        // var mailOptions={
        //     to:email,
        //     subject:"OTP for Registration is:",
        //     html:"<h3>OTP for Account Verification is </h3>" + "<h1 style='font-weight:bold;'>" + otp + "</h1>"
        // }
        transporter.sendMail(mailOptions,(error,info)=>{
            if(error){
                console.log(error)
                response.otpSent=false
            }
            console.log("Message Sent")
        })
        resolve(response)
    })
}

export default sendMail