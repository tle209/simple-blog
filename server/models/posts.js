const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: {
        type: String, require: true, min: 10, max: 255
    },
    body: {
        type: String, require: true, min: 100
    },
    author: {
        type: String, require: true, min: 2, max: 255
    },
    comments: [{ type: mongoose.Schema.ObjectId, require: true, ref: 'Comments' }]
}, { timestamps: true });

PostSchema.virtual('totalComments', {
    ref: 'Comments',
    localField: '_id',
    foreignField: 'post',
    count: true
});

module.exports = mongoose.model('Posts', PostSchema);
