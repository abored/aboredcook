var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        lowercase: true,
        unique: true
    },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
    recipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
    hash: String,
    salt: String
},
{
    timestamps: true
});

UserSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');

    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

UserSchema.methods.validPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');

    return this.hash === hash;
};

UserSchema.methods.generateJWT = function() {

    // udløber efter 60 dage
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign({
        _id: this._id,
        username: this.username,
        exp: parseInt(exp.getTime() / 1000),
    }, 'jegerhemmeligucn');
};

mongoose.model('User', UserSchema);
