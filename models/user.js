const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const { ImageSchema } = require('./image');


// Schema
const userSchema = new Schema({
    email: {
        type: String,
        required: false,
        unique: true
    },
    description: String,
    images: [ImageSchema],
});


// Additions
userSchema.virtual('imageUrl').get(function () {
    return (this.images.length > 0 ? this.images[0].url : 'https://res.cloudinary.com/db6vrbjgz/image/upload/v1607685732/FamilyRecipes/no-image-icon-23485_zd81b3.png');
});

userSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Post.deleteMany({
            _id: {
                $in: doc.reviews
            }
        });
    }
});

userSchema.plugin(passportLocalMongoose);


// Exports
module.exports = mongoose.model('User', userSchema);