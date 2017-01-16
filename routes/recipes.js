var jwt = require('express-jwt');
var mongoose = require('mongoose');

var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty();

var fs = require('fs')
var crypto = require('crypto');

var path = require('path');

var Comment = mongoose.model('Comment');
var User = mongoose.model('User');


var express = require('express'),
    router = express.Router();

var auth = jwt({
    secret: 'jegerhemmeligucn',
    requestProperty: 'payload'
});

var Recipe = mongoose.model('Recipe');

router.get('/search/:searchText', function(req, res, next) {
    console.log(req.params.searchText);

    Recipe.find({
            $text: {
                $search: req.params.searchText
            }
        })
        .exec(function(err, results) {
            console.log(results);
            res.json(results);
        })
});

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
    console.log(req.body.ingredients);

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

router.post('/upload', multipartyMiddleware, function(req, res) {

    //console.log(req.body.recipeId);
    var temp_path = req.files.file.path;
    var imageId = crypto.randomBytes(20).toString('hex');
    var server_path = 'uploads/' + imageId;

    var source = fs.createReadStream(temp_path);
    var dest = fs.createWriteStream(server_path);
    source.pipe(dest);

    source.on('end', function() {
        Recipe.findByIdAndUpdate(req.body.recipeId, {
                $push: {
                    "images": {
                        _id: imageId
                    }
                }
            },
            function(err, recipe) {
                if (err) {
                    return next(err);
                }
                res.json(recipe);
            })

    });

    source.on('error', function(err) {
        return next(err)
    });

});

router.get('/images/:image', function(req, res, next) {

    var file = path.resolve("uploads/" + req.params.image);
    res.contentType('image/*');
    res.sendFile(file);
});

// GET single recipe (her bruger vi router.param middleware injection til at håndtere ":recipe"-id -se middleware routes længere nede)
router.get('/recipes/:recipe', function(req, res, next) {
    req.recipe.populate('comments', function(err, recipe) {
        if (err) {
            return next(err);
        }
        console.log(recipe);
        res.json(recipe);


        /*    recipe.populate('comments.upvotes', function(err, recipe) {
                if (err) {
                    return next(err);
                }
                console.log(recipe);

            })*/
    });

});

router.delete('/recipes/:recipe/delete', auth, function(req, res, next) {
    if (req.recipe.author === req.payload.username) {
        Recipe.remove({
            _id: req.recipe._id
        }, function(err, removed) {
            if (err) {
                return next(err);
            }
            res.json("Recipe removed");
        })
    } else {
        res.json("That's not your recipe!");
    }

});

router.put('/recipes/:recipe/edit', auth, function(req, res, next) {
    if (req.recipe.author === req.payload.username) {
        Recipe.update({
                _id: req.recipe._id
            }, req.body)
            .then(function(success) {
                res.json();
            })
            .catch(function(error) {
                res.status(404).send(err);
            });
    } else {
        res.json("That's not your recipe!");
    }

});


// PUT favorite recipe (bruger upvote metode defineret i modellen for recipe)
router.put('/recipes/:recipe/favorite', auth, function(req, res, next) {
    var query = User.findById(req.payload._id);

    query.exec().then(function(user) {
        var isInArray = user.favorites.some(function(favId) {
            return favId.equals(req.recipe._id);
        });
        console.log(isInArray);

        if (isInArray) {
            User.findByIdAndUpdate(req.payload._id, {
                    $pull: {
                        favorites: req.recipe._id
                    }
                },
                function(err, user) {
                    if (err) {
                        return next(err);
                    }
                })
            req.recipe.unFavorite();
            res.json(false);
        }
        //user har ikke favorited recipe så vi tilføjer den hans array.
        else {
            User.findByIdAndUpdate(req.payload._id, {
                    $push: {
                        "favorites": {
                            _id: req.recipe._id
                        }
                    }
                },
                function(err, user) {
                    if (err) {
                        return next(err);
                    }
                })
            req.recipe.favorite();
            res.json(true);
        }
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
    comment.upvotes = 0;

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





module.exports = router;
