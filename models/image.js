const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// Schema
const ImageSchema = new Schema({
    url: String,
    filename: String
});


// Additions
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});


// Exports
module.exports.ImageSchema = ImageSchema;