const User = require('../models/user');
const Recipe = require('../models/recipe');
const Post = require('../models/post');
const { cloudinary } = require('../cloudinary/index');


module.exports.renderLogin = (req, res) => {
    // Render page
    res.render('users/login');
};

module.exports.login = async (req, res) => {
    // Get logged user
    const user = await User.findById(req.user._id).populate('recipes');

    // Redirect to user page
    res.redirect(user._id);
};

module.exports.renderManage = async (req, res) => {
    // Get users
    const users = await User.find({});

    // Render page
    res.render('users/manage', { users });
};

module.exports.renderNew = (req, res) => {
    // Render page
    res.render('users/new');
};

module.exports.createUser = async (req, res) => {
    // Get data
    const { username, displayname, description, password } = req.body;

    // Update user
    const user = new User({ username, displayname, description });

    // Register user
    await User.register(user, password);

    // Add new images
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    user.images.push(...imgs);

    // Save user
    await user.save();

    // Redirect to profile
    res.redirect('/users/manage');
};

module.exports.renderProfile = async (req, res) => {
    // Get parameters
    const { id } = req.params;

    // Get user and recipes
    const user = await User.findById(id);
    const recipes = await Recipe.find({ chef: user._id });

    // Render page
    res.render('users/profile', { user, recipes });
};

module.exports.updateProfile = async (req, res) => {
    // Get data
    const data = req.body;
    const { id } = req.params;

    // Update user
    const user = await User.findByIdAndUpdate(id, { ...data });

    // Delete images if any exists
    if (user.images.length > 0) {
        for (let image of user.images) {
            await cloudinary.uploader.destroy(image.filename);
        }

        await user.updateOne({ $pull: { images: {} } });
    }

    // Add new images
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    user.images.push(...imgs);

    // Save user
    await user.save();

    // Redirect to profile
    res.redirect(`/users/${user._id}`);
};

module.exports.renderEdit = async (req, res) => {
    // Get parameters
    const { id } = req.params;

    // Get user
    const user = await User.findById(id);

    // Render page
    res.render('users/edit', { user });
};

module.exports.deleteUser = async (req, res) => {
    // Get parameters
    const { id } = req.params;

    // Get user and associated recipes and posts
    const user = await User.findById(id);
    const recipes = await Recipe.find({ chef: user._id });

    // Delete images
    for (let image of user.images) {
        await cloudinary.uploader.destroy(image.filename);
    }

    // Delete recipe images
    for (let recipe of recipes) {
        for (let image of recipe.images) {
            await cloudinary.uploader.destroy(image.filename);
        }
    }

    // Delete recipes from database
    Recipe.deleteMany({ chef: user._id });

    // Delete posts
    Post.deleteMany({ author: user._id });

    // Delete user
    await User.findByIdAndRemove(user._id);

    // Redirect to manage
    res.redirect('/users/manage');
};

module.exports.logout = (req, res) => {
    // Logout
    req.logout();

    // Delete session
    req.session.destroy();

    // Redirect to home
    res.redirect('/');
};