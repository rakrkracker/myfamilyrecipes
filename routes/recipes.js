const express = require('express');
const router = express.Router();
const recipesController = require('../controllers/recipes');
const catchAsync = require('../utils/catchAsync');
const multer = require('multer');
const { storage } = require('../cloudinary/index');
const upload = multer({ storage });


// Define routes
router.route('/')
    .get(catchAsync(recipesController.renderIndex))
    .post(upload.array('images'), catchAsync(recipesController.createRecipe));

router.route('/new')
    .get(catchAsync(recipesController.renderNew));

router.route('/:id')
    .get(catchAsync(recipesController.showRecipe))
    .put(upload.array('images'), catchAsync(recipesController.updateRecipe));

router.route('/:id/edit')
    .get(catchAsync(recipesController.renderEdit));


// Export routes
module.exports = router;