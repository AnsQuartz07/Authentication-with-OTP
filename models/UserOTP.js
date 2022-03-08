const { default: mongoose } = require('mongoose');
const mongooge = require('mongoose');
const Schema = mongoose.Schema;
const userOtpSchema = new Schema({ 
    userId: String,
    otp: String
});

// const UserOtp = mongoose.model(
//     "UserOtp",
//     UserOtpSchema
// );

// model.exports = UserOtp;

module.exports = mongoose.model('UserOtp', userOtpSchema);