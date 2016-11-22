var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
  body: String,
  author: String,
  recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]

});

mongoose.model('Comment', CommentSchema);
