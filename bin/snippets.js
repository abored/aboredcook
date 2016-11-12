//before addToSet
if (user.favorites.includes(req.recipe._id)) {
    user.update({
        _id: user._id
    }, {
        $pull: {
            "favorites": req.recipe._id
        }
    });
    req.recipe.unFavorite(function(err, recipe) {
        if (err) {
            return next(err);
        }
        res.json(recipe);
    })
}
//user har ikke favorited recipe så vi tilføjer den hans array.
else {
    user.update({
        _id: user._id
    }, {
        $pull: {
            "favorites": req.recipe._id
        }
    });
    req.recipe.Favorite(function(err, recipe) {
        if (err) {
            return next(err);
        }
        res.json(recipe);
    })
}



//////////

function getUserByIdPromise(id) {
    var promise = User.findById(req.payload._id).exec();
    return promise;
}

var userPromise = getUserByIdPromise(req.payload._id);
console.log(userPromise);
userPromise.then(function(user) {
    console.log(user);

    User.update({
            _id: user._id
        }, {
            favorites: "1"
        }, null, cb,
        function(err, affected, resp) {
            console.log(err)
            console.log(affected)
            console.log(resp);
        })
})
