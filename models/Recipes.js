var mongoose = require('mongoose');

var IngredientSchema = new mongoose.Schema({
    name: String,
    amount: Number,
    unit: String,

});

var RecipeSchema = new mongoose.Schema({
    title: {
        type: String,
        index: true
    },
    author: {
        type: String,
        index: true
    },
    ingredients: [IngredientSchema],
    description: String,
    howto: String,

    preptime: Number,
    people: Number,

    favorites: {
        type: Number,
        default: 0
    },
    upvotes: {
        type: Number,
        default: 0
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    images: [String]
});

RecipeSchema.methods.upvote = function(callback) {
    this.upvotes += 1;
    this.save(callback);
};

RecipeSchema.methods.favorite = function(callback) {
    this.favorites += 1;
    this.save(callback);
    console.log("+1")
};

RecipeSchema.methods.unFavorite = function(callback) {
    this.favorites -= 1;
    this.save(callback);
    console.log("-1")
};

RecipeSchema.index({'$**': 'text'});

mongoose.model('Recipe', RecipeSchema);
