var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Recipe = mongoose.model('Recipe');
var Comment = mongoose.model('Comment');

var passport = require('passport');

// GET recipes
router.get('/recipes', function(req, res, next) {
    Recipe.find(function(err, recipes) {
        if (err) {
            return next(err);
        }

        res.json(recipes);
    });
});

// /recipe en recipe (lel)
router.post('/recipes', function(req, res, next) {
    var recipe = new Recipe(req.body);

    recipe.save(function(err, recipe) {
        if (err) {
            return next(err);
        }

        res.json(recipe);
    });
});



//her bruger vi router.param middleware injection ved ":recipe" - very sexy
router.get('/recipes/:recipe', function(req, res) {
    req.recipe.populate('comments', function(err, recipe) {
        if (err) {
            return next(err);
        }

        res.json(recipe);
    });
});

//upvote en recipe - bruger upvote metode defineret i modellen for recipe
router.put('/recipes/:recipe/upvote', function(req, res, next) {
    req.recipe.upvote(function(err, recipe) {
        if (err) {
            return next(err);
        }

        res.json(recipe);
    });
});

router.put('/recipes/:recipe/comments/:comment/upvote', function(req, res, next) {
    req.recipe.comment.upvote(function(err, comment) {
        if (err) {
            return next(err);
        }

        res.json(comment);
    });
});

//tilføj comment til recipe
router.post('/recipes/:recipe/comments', function(req, res, next) {
    var comment = new Comment(req.body);
    comment.recipe = req.recipe;

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

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {});
});


//MIDDLEWARE JAMS

//slick as fuck middleware til single recipe retrival
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

//slick as fuck middleware til single recipe retrival
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
