var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var jwt = require('express-jwt');


var auth = jwt({
    secret: 'jegerhemmeligucn',
    userProperty: 'payload'
});

var User = mongoose.model('User');

/******************************
 *         USERS ROUTES       *
 ******************************/

// GET single user
router.get('/users/:user', function(req, res, next) {

    req.user.populate('recipes', 'title author preptime people comments favorites', function(err, user) {
        if (err) {
            return next(err);
        }
        req.user.populate('favorites', 'title author preptime people comments favorites', function(err, user) {
            if (err) {
                return next(err);
            }

            res.json(user);
        });
    });

});

// middleware til GET user
router.param('user', function(req, res, next, id) {
    var query = '';
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

router.put('/me/edit', auth, function(req, res, next) {
    User.findByIdAndUpdate(req.payload._id, {
        $set: req.body
    }, function(err, user) {
        if (err) {
            return next(err);
        }
        res.json(user)
    });
})


module.exports = router;
