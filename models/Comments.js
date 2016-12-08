var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
        body: String,
        author: String,
        upvotes: Number,
        recipe: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Recipe'
        }
    },

    {
        timestamps: true
    });

CommentSchema.methods.upvote = function(callback) {
    this.upvotes += 1;
    this.save(callback);
    console.log("+1!")
};

mongoose.model('Comment', CommentSchema);
