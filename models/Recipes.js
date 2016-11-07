var mongoose = require('mongoose');

var RecipeSchema = new mongoose.Schema({
  title: String,
  link: String,
  upvotes: {type: Number, default: 0},
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});

RecipeSchema.methods.upvote = function(callback) {
  this.upvotes += 1;
  this.save(callback);
};

mongoose.model('Recipe', RecipeSchema);
