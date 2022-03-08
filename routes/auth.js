
//============================== Authentification Routes =============================================

const router = require('express').Router();
const User = require('../models/User');         // Importing the user.js file so that we have accss of user.js file 
const UserOtp = require('../models/UserOTP');
const dotenv = require('dotenv');      // Imprt dotenv (an environment variable where I can store my password if I will upload the code on github or something)
dotenv.config();
const nodemailer = require('nodemailer');


router.post('/register', async (req, res) => {      //creating link  http://localhosts3000:api/user/register
    // Checking whether the user is already existing in the Database
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).json({message:'Email already exists.'});

    // Creating a new user
    const user = new User({
       name: req.body.name,
       email: req.body.email,
       password: req.body.password,
       verified: false                // by default it is set to false. Once otp verification complete then it will be true.
   });                                // saving the user's informations
       user
       .save()
       .then((result)=>{
           sendOTP(result,res)
       })
       .catch((err)=>{
           res.json({error:err})
       })
});

// Login
router.post('/login', async (req, res) => {       //creating link  http://localhosts3000:api/user/login

    // Checking whether the user is already existing in the Database
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).json({message:'Email not found.'});

    // Password req.body.password, user.password is correct
    if(req.body.password===user.password) {
        if(user.verified===false) res.status(400).json({message:'Please Activate your account by OTP'});
        return res.status(200).json({message:`Successfully Logged In.`});
    }
    res.status(400).json({message:'Invalid Password'});

});
// nodemailer stuff
let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    service : 'Gmail',
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS
    }
})

// send otp verification email
const sendOTP = async({_id,email},res) =>{
    try {
        const otp = Math.floor(1000 + Math.random()*9000);

        //mail option
        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: "Verify your Email",
            html: `<p>Enter the otp : <b>${otp}</b> for verification</p>`,
        }

        const newOtp = await new UserOtp({
            userId: _id,
            otp: otp,
            createdAt: Date.now()
        });

        // save otp record
        await newOtp.save();
        await transporter.sendMail(mailOptions);
        res.json({
            status: "pending",
            message: "Please verify the otp sent to your email",
            data: {
                userId: _id,
                email
            }
        })

    } catch (error){
        res.json({
            status: "failed",
            message: error.message
        })
    }
}

router.post('/verify', async(req,res)=>{

    const otpRecord = await UserOtp.findOne({userId:req.body.id});
    //console.log("succeed")
    if(req.body.otp===otpRecord.otp){
        
        await User.updateOne({_id:req.body.id},{verified:true});
        await UserOtp.deleteMany({userId:req.body.id});
        res.json({
            status:"verified",
            message:"email verified successfully"
        })
    }else{
        res.json({err: error});
    }
})


module.exports = router;