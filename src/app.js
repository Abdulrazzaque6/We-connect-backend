import express from 'express';
import { generateOTP } from './utils/getOtp.js';
import { Post } from './models/posts/posts.models.js';
import twilio from 'twilio';

export const app = express()

app.use(express.json())
const sid = process.env.sid
const token = process.env.token
const phone = process.env.phone
const client = twilio(sid, token)


app.post('/create_post', async (req, res)=>{

    const post = await Post.create(req.body)
    console.log(req.body)
    console.log(post)
    res.send(post)
})
const otpStore = new Map()

app.post('/get_otp',(req, res)=>{ 
const {client_phone} = req.body

if(!client_phone){
    return res.status(400).json({error:"invalid phone number"})
}
const otp =  Math.floor(100000 + Math.random()* 900000)
console.log(otp)
otpStore.set(client_phone,otp)
console.log(otpStore)
try {
    client.messages.create({
        to : "+91" + client_phone,
        from : phone,
        body : "Your otp for " + client_phone  + " is " + otp
    })
} catch (error) {
    console.log(error)
}
res.end()
})



app.post("/verify_otp", (req, res) => {
    const { client_phone, otp } = req.body; // Assuming phone and OTP are provided in the request body
    console.log(otpStore)

    if (!client_phone || !otp) {
        return res.status(400).json({ error: "Phone number and OTP are required" });
    }

    const storedOtp = otpStore.get(client_phone);

    if (storedOtp === otp) {
        otpStore.delete(client_phone); // Remove OTP after successful verification
        try {
            const message = client.messages.create({
                to: "+91"+client_phone,
                from: phone,
                body: "Account verified successfully"
            })
            console.log("message id : " + message.sid)
        } catch (error) {
            res.write(error)
        }
        return res.json({ message: "OTP verified successfully" });
    } else {
        return res.status(400).json({ error: "Invalid OTP" });
    }
    res.end()
});
