const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Post = require('./post');
const { ImageSchema } = require('./image');


// Schema
const recipeSchema = new Schema({
    title: String,
    description: String,
    ingredients: [String],
    steps: [String],
    chef: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    time: String,
    images: [ImageSchema],
    posts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Post'
        }
    ]
});


// Additions
recipeSchema.virtual('imageUrl').get(function () {
    return (this.images.length > 0 ? this.images[0].url : 'https://res.cloudinary.com/db6vrbjgz/image/upload/v1607685732/FamilyRecipes/no-image-icon-23485_zd81b3.png');
});

recipeSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Post.deleteMany({
            _id: {
                $in: doc.reviews
            }
        });
    }
});


// Exports
module.exports = mongoose.model('Recipe', recipeSchema);