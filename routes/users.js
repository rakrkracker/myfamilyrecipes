const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const multer = require('multer');
const { storage } = require('../cloudinary/index');
const upload = multer({ storage });
const { isAdmin, isUserOwner, isLoggedIn } = require('../middleware');


// Define routes
router.route('/')
    .post(isLoggedIn, isAdmin, upload.array('image'), catchAsync(usersController.createUser));

router.route('/login')
    .get(usersController.renderLogin)
    .post(passport.authenticate('local', { failureRedirect: '/users/login' }), usersController.login);

router.route('/manage')
    .get(isLoggedIn, isAdmin, catchAsync(usersController.renderManage));

router.route('/new')
    .get(isLoggedIn, usersController.renderNew);

router.route('/:id')
    .get(catchAsync(usersController.renderProfile))
    .put(isLoggedIn, isUserOwner, upload.array('image'), catchAsync(usersController.updateProfile))
    .delete(isLoggedIn, isUserOwner, catchAsync(usersController.deleteUser));

router.route('/:id/edit')
    .get(isLoggedIn, isUserOwner, catchAsync(usersController.renderEdit));

router.route('/:id/logout')
    .get(isLoggedIn, usersController.logout);


// Export routes
module.exports = router;