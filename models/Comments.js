var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
  body: String,
  author: String,
  upvotes: {type: Number, default: 0},
  recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }
});
CommentSchema.methods.upvote = function(callback) {
  this.upvotes += 1;
  this.save(callback);
};

mongoose.model('Comment', CommentSchema);
