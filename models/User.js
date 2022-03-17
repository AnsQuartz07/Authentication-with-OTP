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
      verified: {
          type: Boolean
      }
});

module.exports = mongoose.model('User', userSchema);
