const express = require('express');
const router = express.Router({ mergeParams: true });
const posts = require('../controllers/posts');
const catchAsync = require('../utils/catchAsync');


// Define routes
router.post('/', catchAsync(posts.createPost));


// Export routes
module.exports = router;