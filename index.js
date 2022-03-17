const express = require('express');
const app = express();
const dotenv = require('dotenv');      // Imprt dotenv (an environment variable where I can store my password if I will upload the code on github or something)
const mongoose = require('mongoose');  // Import the mongooge package

//Import Routes
const authRoutes = require('./routes/auth.js');

dotenv.config();

//connect to database
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => 
console.log('connected to db!')
);
  
// //middleware
app.use(express.json()); // json is a format. it makes sure that

//Routes Middlewares
app.use('/api/user',authRoutes);           // creating link see auth.js line no - 14

//app.listen(process.env.port, () => console.log('Server Up and running'));   //to print somethings console.log 
var port = 9000;
app.listen(port, function () {
  console.log("Server Has Started!");
});