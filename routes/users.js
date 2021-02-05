const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const multer = require('multer');
const { storage } = require('../cloudinary/index');
const upload = multer({ storage });


// Define routes
router.route('/')
    .post(upload.array('image'), catchAsync(usersController.createUser));

router.route('/login')
    .get(usersController.renderLogin)
    .post(passport.authenticate('local', { failureRedirect: '/users/login' }), usersController.login);

router.route('/manage')
    .get(catchAsync(usersController.renderManage));

router.route('/new')
    .get(usersController.renderNew);

router.route('/:id')
    .get(catchAsync(usersController.renderProfile))
    .put(upload.array('image'), catchAsync(usersController.updateProfile))
    .delete(catchAsync(usersController.deleteUser));

router.route('/:id/edit')
    .get(catchAsync(usersController.renderEdit));

router.route('/:id/logout')
    .get(usersController.logout);


// Export routes
module.exports = router;