const express = require('express');
const router = express.Router();
const recipesController = require('../controllers/recipes');
const catchAsync = require('../utils/catchAsync');
const multer = require('multer');
const { storage } = require('../cloudinary/index');
const upload = multer({ storage });
const { isRecipeOwner, isLoggedIn } = require('../middleware');


// Define routes
router.route('/')
    .get(catchAsync(recipesController.renderIndex))
    .post(isLoggedIn, upload.array('images'), catchAsync(recipesController.createRecipe));

router.route('/new')
    .get(catchAsync(recipesController.renderNew));

router.route('/:id')
    .get(catchAsync(recipesController.showRecipe))
    .put(isLoggedIn, isRecipeOwner, upload.array('images'), catchAsync(recipesController.updateRecipe))
    .delete(isLoggedIn, isRecipeOwner, catchAsync(recipesController.deleteRecipe));

router.route('/:id/edit')
    .get(isLoggedIn, isRecipeOwner, catchAsync(recipesController.renderEdit));


// Export routes
module.exports = router;