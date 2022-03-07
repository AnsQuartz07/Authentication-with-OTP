
//============================== Authentification Routes =============================================

const router = require('express').Router();
const User = require('../User');         // Importing the user.js file so that we have accss of user.js file 

router.post('/register', async (req, res) => {      //creating link  http://localhosts3000:api/user/register
    // Checking whether the user is already existing in the Database
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).json({message:'Email already exists.'});

    // Creating a new user
    const user = new User({
       name: req.body.name,
       email: req.body.email,
       password: req.body.password
   });
   try{                                         // saving the user's informations
       const savedUser = await user.save();
       const x = req.body;
       res.status(200).json({message:`Account of ${x.name} has been created successfully.`, user_Id: user._id}); 
   } catch (err) {                              // Indication of any error
       res.status(400).json({message: err});
    }

});

// Login
router.post('/login', async (req, res) => {       //creating link  http://localhosts3000:api/user/login

    // Checking whether the user is already existing in the Database
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).json({message:'Email not found.'});

    // Password req.body.password, user.password is correct
    if(req.body.password===user.password) return res.status(200).json({message:`Successfully Logged In.`});
    res.status(400).json({message:'Invalid Password'});

});

module.exports = router;