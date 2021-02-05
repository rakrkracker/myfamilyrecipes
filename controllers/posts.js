const Recipe = require('../models/recipe');
const Post = require('../models/post');


module.exports.createPost = async (req, res) => {
    // Get recipe
    const recipe = await Recipe.findById(req.params.id);

    // Create post
    const post = new Post(req.body.post);
    post.author = req.user._id;

    // Add post to recipe
    recipe.posts.push(post);

    // Save post and recipe
    await recipe.save();
    await post.save();

    // Redirect to recipe page
    res.redirect(`/recipes/${recipe._id}`);
};