var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var passport = require('passport');

var User = mongoose.model('User');

// GET single user
router.get('/users/:user', function(req, res, next) {

    //scrub auth-sager
    req.user.hash = "";
    req.user.salt = "";

    //populate user med recipes
    req.user.populate('recipes', 'title author preptime people comments favorites', function(err, user) {
        if (err) {
            return next(err);
        }
        //populate den opdaterede user igen, for favorites
        user.populate('favorites', 'title author preptime people comments favorites', function(err, popuser) {
            if (err) {
                return next(err);
            }
            //send den færdige user tilbage
            res.json(popuser);
        });
    });
});

// middleware til GET user
router.param('user', function(req, res, next, id) {
    var query = '';

    //regex der checker om id er et ObjectId (brug findById), eller antag id er brugernavn og brug findOne (ok fordi username er unik)
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        query = User.findById(id);
    } else {
        query = User.findOne({
            'username': id
        });
    }

    query.exec(function(err, user) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return next(new Error('can\'t find user'));
        }

        req.user = user;
        return next();
    });
});

//POST register ny bruger
router.post('/register', function(req, res, next) {
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({
            message: 'Udfyld alle felter'
        });
    }

    var user = new User();
    user.username = req.body.username;
    user.setPassword(req.body.password)

    user.save(function(err) {
        if (err) {
            if (err.code === 11000) {
                console.log(err);
                return res.status(422).json({
                    message: 'Brugernavn allerede i brug'
                });
            } else if (err) {
                console.log(err);
                return res.status(400).json({
                    message: 'Ukendt fejl'
                });
            }
        }
        return res.json({
            token: user.generateJWT()
        })
    });
});

router.post('/login', function(req, res, next) {
  console.log(req.body);
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({
            message: 'Udfyld alle felter'
        });
    }

    passport.authenticate('local', function(err, user, info) {
      console.log(user);
        if (err) {
            return next(err);
        }

        if (user) {
            return res.json({
                token: user.generateJWT()
            });
        } else {
            return res.status(401).json(info);
        }
    })(req, res, next);
});

module.exports = router;
