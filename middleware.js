const User = require('./models/user');
const Recipe = require('./models/recipe');
const Post = require('./models/post');


module.exports.isLoggedIn = async (req, res, next) => {
    // Check if user is authenticated (logged in passport)
    if (!req.isAuthenticated()) {
        // Redirect to login
        return res.redirect('/users/login');
    }
    next();
}

module.exports.isAdmin = async (req, res, next) => {
    // Get current user
    const user = res.locals.currentUser;

    // Check if user exists and is admin
    if (!(user && user.isAdmin)) {
        // Redirect to home
        return res.redirect('/');
    }
    next();
}

module.exports.isUserOwner = async (req, res, next) => {
    // Get data
    const { id } = req.params;

    // Get users
    const currentUser = res.locals.currentUser;
    const user = await User.findById(id);

    // Check if current user is logged in
    if (!(currentUser && user)) {
        // Redirect to profile
        return res.redirect(`/users/${id}`);
    }
    if (!user._id.equals(currentUser._id)) {
        // Redirect to profile
        return res.redirect(`/users/${id}`);
    }
    next();
}

module.exports.isRecipeOwner = async (req, res, next) => {
    // Get data
    const { id } = req.params;

    // Get user and recipe
    const currentUser = res.locals.currentUser;
    const recipe = await Recipe.findById(id);

    // Check if current user is logged in
    if (!(currentUser && recipe)) {
        // Redirect to profile
        return res.redirect(`/recipes/${id}`);
    }
    if (!recipe.chef.equals(currentUser._id)) {
        // Redirect to profile
        return res.redirect(`/recipes/${id}`);
    }
    next();
}

module.exports.isPostOwner = async (req, res, next) => {
    // Get data
    const { id, postId } = req.params;

    // Get user and post
    const currentUser = res.locals.currentUser;
    const post = await Post.findById(postId);

    // Check if current user is logged in
    if (!(currentUser && post)) {
        // Redirect to profile
        return res.redirect(`/recipes/${id}`);
    }
    if (!post.author.equals(currentUser._id)) {
        // Redirect to profile
        return res.redirect(`/recipes/${id}`);
    }
    next();
}