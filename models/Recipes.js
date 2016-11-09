var mongoose = require('mongoose');

var RecipeSchema = new mongoose.Schema({
  title: String,
  ingredients: String,
  author: String,
  upvotes: {type: Number, default: 0},
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});

RecipeSchema.methods.upvote = function(callback) {
  this.upvotes += 1;
  this.save(callback);
};

RecipeSchema.index({title: 'text', ingredients: 'text' });

mongoose.model('Recipe', RecipeSchema);
