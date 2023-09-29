const router = require("express").Router();
const User = require("../models/User"); // Importing the user.js file so that we have accss of user.js file
const UserOtp = require("../models/UserOTP");
const nodemailer = require("nodemailer");
// const service = require('../Service/authService')
const cron = require('node-cron');

module.exports.register = async (req, res) => {
  try {
    // Checking whether the user is already existing in the Database // priyapatna08101999
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) {
      return res.status(400).json({ message: "Email already exists." });
    }
    const otp = Math.floor(1000 + Math.random() * 9000);
    // Creating a new user
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      age: req.body.age,
      otp: otp,
      verified: false, // by default it is set to false. Once otp verification complete then it will be true.
    }); // saving the user's informations
    let result = await user.save()
    
    // nodemailer stuff
    const authEmail = process.env.AUTH_EMAIL;
    let authPass = process.env.APP_PASS;
    
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      service: "Gmail",
      auth: {
        user: authEmail,
        pass: authPass,
      },
    });
    
    //send otp function
    const sendOTP = async ({ _id, email, otp }, res) => {
      try {
        // generating a random otp of four digits
        //mail option
        const mailOptions = {
          from: authEmail,
          to: email,
          subject: "Verify your Email",
          html: `<p>Otp for authentification at Nodejs intern project for user id
        : <b>${_id}</b> is :  <b>${otp}</b> . Do not share it with anyone.</p>`,
        };
        
        const newOtp = new UserOtp({
          userId: _id,
          otp: otp,
          createdAt: Date.now(),
        });
        
        // save otp record
        await Promise.all([
          newOtp.save(),
          transporter.sendMail(mailOptions)
        ])
        res.json({
          status: "pending",
          message: "Please verify the otp sent to your email",
          data: {
            userId: _id,
            email,
          },
        });
      } catch (error) {
        res.json({
          status: "failed",
          message: error.message,
        });
      }
    };
    
    sendOTP(result, res, otp); // calling the function to send the otp
    
  } catch (err) {
    console.log(err)
    res.status(500).json({ message : 'something went wrong',error: err });
  }
}
module.exports.login = async (req, res) => {
  // Checking whether the user is already existing in the Database
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).json({ message: "Email not found." });
  
  // Password req.body.password, user.password is correct
  if (req.body.password === user.password) {
    if (user.verified === false)
    res
    .status(400)
    .json({ message: "Please Activate your account by OTP" });
    return res.status(200).json({ message: `Successfully Logged In.` });
  }
  res.status(400).json({ message: "Invalid Password" });
}

// send otp verification email
module.exports.verify = async (req, res) => {
  // nodemailer stuff
  const otpRecord = await User.findOne({ email: req.body.email });
  console.log("succeed", req.body, otpRecord.otp)
  if (req.body.otp == otpRecord.otp) {
    await User.updateOne({ email: req.body.email }, {$set:{ verified: true} });
    // await UserOtp.deleteMany({ userId: req.body.userId });
    res.json({
      status: "verified",
      message: "email verified successfully",
    });
  } else {
    res.status(401).json({ err: 'Incorrect Otp' });
  }
}

// delete
module.exports.delete = async (req, res) => {
  // Checking for non-existing student
  const emailExist = await User.findOne({ email: req.params.email });
  if (!emailExist)
  return res.status(400).json({ message: "Email not found !" });
  
  // Deletion of particular data from database
  User.deleteOne({ email: req.params.email })
  .then((result) => {
    res
    .status(200)
    .json({ message: "successfully deleted", result: result });
  })
  .catch((err) => {
    res.status(500).json({
      message: "something went wrong",
      error: err,
    });
  });
}

module.exports.bhoot = async (req,res) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    service: "Gmail",
    auth: {
      user: process.env.AUTH_EMAIL,
      pass: process.env.APP_PASS
    },
  });
  const sentOtp = async ( email ) => {
    try {
      
      //mail option
      const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: "Tum bhootni ho",
        attachments: [
          {
            filename: 'pic1.jpg',
            path: 'D:/Desktop/Authentication-with-OTP/pic1.jpg',
            cid: 'logo'
          },
          {
            filename: 'pic2.jpg',
            path: 'D:/Desktop/Authentication-with-OTP/pic2.jpg',
            cid: 'logo'
          },
          {
            filename: 'pic3.jpg',
            path: 'D:/Desktop/Authentication-with-OTP/pic3.jpg',
            cid: 'logo'
          }
        ],
        html: `<p>Tum apni shakal dekho Photo bheje h
        : <b></b> is : <b></b> . Do not share it with anyone.</p>`,
      };
      
      await transporter.sendMail(mailOptions)
      console.log('running')
    } catch (error) {
      res.json({
        status: "failed",
        message: error.message,
      });
    }
  };
  let i = 1;
  cron.schedule('*/10 * * * * *', async () => {
   await sentOtp(req.params.email);
    console.log('running a task every 10 sec ', i++);
  });
  
}
