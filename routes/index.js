var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('express-jwt');

//load models
var Recipe = mongoose.model('Recipe');
var Comment = mongoose.model('Comment');
var User = mongoose.model('User');

//middleware til at godkende gyldighed af JWT-token
var auth = jwt({
    secret: 'jegerhemmeligucn',
    userProperty: 'payload'
});

// GET homepage (vores SPA index.ejs)
router.get('/', function(req, res) {
    res.render('index.ejs', {});
});

/******************************
 *   RECIPE & COMMENT ROUTES  *
 ******************************/

// GET all recipes
router.get('/recipes', function(req, res, next) {
    Recipe.find(function(err, recipes) {
        if (err) {
            return next(err);
        }

        res.json(recipes);
    });
});

// POST recipe
router.post('/recipes', auth, function(req, res, next) {
    var recipe = new Recipe(req.body);

    //hent og sæt username fra jwt-payload (slip for at query db for username)
    recipe.author = req.payload.username;

    recipe.save(function(err, recipe) {
        if (err) {
            return next(err);
        }

        //Opret reference til users "recipe"-array, der holder alle recipe id's brugeren har lavet
        User.findByIdAndUpdate(req.payload._id, {
                $push: {
                    "recipes": {
                        _id: recipe._id
                    }
                }
            },
            function(err, user) {
                if (err) {
                    return next(err);
                }
            })
        res.json(recipe);
    });
});



// GET single recipe (her bruger vi router.param middleware injection til at håndtere ":recipe"-id -se middleware routes længere nede)
router.get('/recipes/:recipe', function(req, res, next) {
    req.recipe.populate('comments', function(err, recipe) {
        if (err) {
            return next(err);
        }
        res.json(recipe);
    });
});

// PUT upvote recipe (bruger upvote metode defineret i modellen for recipe)
router.put('/recipes/:recipe/upvote', auth, function(req, res, next) {
    req.recipe.upvote(function(err, recipe) {
        if (err) {
            return next(err);
        }

        res.json(recipe);
    });
});

// PUT upvote comment
router.put('/recipes/:recipe/comments/:comment/upvote', auth, function(req, res, next) {
    req.recipe.comment.upvote(function(err, comment) {
        if (err) {
            return next(err);
        }

        res.json(comment);
    });
});

// POST comment til recipe
router.post('/recipes/:recipe/comments', auth, function(req, res, next) {
    var comment = new Comment(req.body);
    comment.recipe = req.recipe;
    comment.author = req.payload.username;

    comment.save(function(err, comment) {
        if (err) {
            return next(err);
        }

        req.recipe.comments.push(comment);
        req.recipe.save(function(err, recipe) {
            if (err) {
                return next(err);
            }
            res.json(comment);
        });
    });
});

//middleware til GET recipes
router.param('recipe', function(req, res, next, id) {
    var query = Recipe.findById(id);

    query.exec(function(err, recipe) {
        if (err) {
            return next(err);
        }
        if (!recipe) {
            return next(new Error('can\'t find recipe'));
        }

        req.recipe = recipe;
        return next();
    });
});

//middleware til GET comment
router.param('comment', function(req, res, next, id) {
    var query = Comment.findById(id);

    query.exec(function(err, comment) {
        if (err) {
            return next(err);
        }
        if (!comment) {
            return next(new Error('can\'t find comment'));
        }

        req.recipe.comment = comment;
        return next();
    });
});


/******************************
 *         USERS ROUTES       *
 ******************************/

// GET single user
router.get('/users/:user', function(req, res, next) {
    req.user.populate('recipes', function(err, user) {
        if (err) {
            return next(err);
        }

        res.json(user);
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

/******************************
 *    AUTHENTICATION ROUTES   *
 ******************************/

//POST register ny bruger
router.post('/register', function(req, res, next) {
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({
            message: 'Please fill out all fields'
        });
    }

    var user = new User();

    user.username = req.body.username;

    user.setPassword(req.body.password)

    user.save(function(err) {
        if (err) {
            return next(err);
        }

        return res.json({
            token: user.generateJWT()
        })
    });
});

router.post('/login', function(req, res, next) {
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({
            message: 'Please fill out all fields'
        });
    }

    passport.authenticate('local', function(err, user, info) {
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

//Eksponér alle routes i vores express router
module.exports = router;
