const Recipe = require('../models/recipe');
const { cloudinary } = require('../cloudinary/index');


module.exports.renderIndex = async (req, res) => {
    // Get recipes
    const recipes = await Recipe.find({}).populate('chef');

    // Render page
    res.render('recipes/index', { recipes });
};

module.exports.renderNew = async (req, res) => {
    // Render page
    res.render('recipes/new');
};

module.exports.createRecipe = async (req, res) => {
    // Get Data
    const data = req.body;

    // Create recipe and add user
    const recipe = new Recipe(data);
    const user = res.locals.currentUser;

    recipe.chef = user._id;
    recipe.images = req.files.map(f => ({ url: f.path, filename: f.filename }));

    // Save recipe
    await recipe.save();

    // Redirect to profile
    res.redirect(`/users/${user._id}`);
};

module.exports.showRecipe = async (req, res) => {
    // Get recipes (with chef and posts)
    const recipe = await Recipe.findById(req.params.id).populate('chef').populate({
        path: 'posts',
        populate: {
            path: 'author'
        }
    });

    // Render page
    res.render('recipes/show', { recipe });
};

module.exports.renderEdit = async (req, res) => {
    // Get parameters
    const { id } = req.params

    // Get Recipe
    const recipe = await Recipe.findById(id);

    // Render page
    res.render('recipes/edit', { recipe });
};

module.exports.updateRecipe = async (req, res) => {
    // Get Data
    const data = req.body;
    const { id } = req.params;

    // Find recipe and update (with user)
    const recipe = await Recipe.findByIdAndUpdate(id, { ...data });
    const user = res.locals.currentUser;

    recipe.chef = user._id;

    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    recipe.images.push(...imgs);

    // Save recipe
    await recipe.save();

    // Delete images if necessary
    if (req.body.deleteImages) {
        for (let filename of data.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }

        await recipe.updateOne({ $pull: { images: { filename: { $in: data.deleteImages } } } });
    }

    // Redirect to profile
    res.redirect(`/users/${user._id}`);
};