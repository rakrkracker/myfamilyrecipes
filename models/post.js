const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// Schema
const postSchema = new Schema({
    body: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});


// Exports
module.exports = mongoose.model('Post', postSchema);