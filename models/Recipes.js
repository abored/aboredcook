var mongoose = require('mongoose');

var RecipeSchema = new mongoose.Schema({
  title: String,
  author: String,
  ingredients: String,
  description: String,
  howto : String,

  preptime: Number,
  people : Number,
  
  favorites: {type: Number, default: 0},
  upvotes: {type: Number, default: 0},
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});

RecipeSchema.methods.upvote = function(callback) {
  this.upvotes += 1;
  this.save(callback);
};

RecipeSchema.methods.favorite = function(callback) {
  this.favorites += 1;
  this.save(callback);
};

RecipeSchema.methods.unFavorite = function(callback) {
  this.favorites -= 1;
  this.save(callback);
};



RecipeSchema.index({title: 'text', ingredients: 'text' });

mongoose.model('Recipe', RecipeSchema);
