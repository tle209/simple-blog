const mongoose = require('mongoose');

const CommentModel = mongoose.model('Comments', mongoose.Schema({
    post: {
        type: mongoose.Schema.ObjectId, require: true, index: true, ref: 'Posts',
    },
    content: {
        type: String, require: true, min: 20, max: 255
    },
    author: {
        type: String, require: true, min: 3, max: 255
    },
}, { timestamps: true }));

module.exports = CommentModel;
