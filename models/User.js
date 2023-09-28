const mongoose = require('mongoose');

//Create s Schema which represents the model of the user.
const userSchema = new mongoose.Schema({   
    name: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    email: {
        type: String,
        required: true,
        max: 255,
        min: 6
    },
    password: {
        type: String,
        required: true,
        max: 1024,
        min: 6
    },
    age: {
        type: Number,
        max: 100,
        min: 5
    },
    otp: {
        type: Number,
        max: 9999,
        min: 1000
    },
    verified: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('User', userSchema);
