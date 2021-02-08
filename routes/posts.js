const express = require('express');
const router = express.Router({ mergeParams: true });
const postsController = require('../controllers/posts');
const catchAsync = require('../utils/catchAsync');
const { isPostOwner, isLoggedIn } = require('../middleware');


// Define routes
router.route('/')
    .post(isLoggedIn, catchAsync(postsController.createPost));

router.route('/:postId')
    .delete(isLoggedIn, isPostOwner, catchAsync(postsController.deletePost));


// Export routes
module.exports = router;