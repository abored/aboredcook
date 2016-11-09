// load the things we need
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');

//users
var userSchema = new mongoose.Schema({
        uid          : String,
        token        : String,
        type         : String,
        email        : String,
        username     : String,
        recipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }]
    });

userSchema.methods.generateJWT = function() {
  // set expiration to 60 days
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign({
    _id: this._id,
    username: this.username,
    exp: parseInt(exp.getTime() / 1000)
  }, 'SECRET');
};

// create the model for users and expose it to our app
mongoose.model('User', userSchema);
