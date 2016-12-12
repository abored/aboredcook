var mongoose = require('mongoose');

var IngredientSchema = new mongoose.Schema({
    name: String,
    amount: Number,
    unit: String,
});

var RecipeSchema = new mongoose.Schema({
        title: String,
        author: String,
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
        comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
        images: [String]
    },
    {
        timestamps: true
    });

RecipeSchema.index({title: 'text', author: 'text', 'ingredients.name': 'text' });

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

mongoose.model('Recipe', RecipeSchema);
