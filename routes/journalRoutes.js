const express = require('express');
const router = express.Router();
const { createJournal, renderCompose, renderBlog,renderBlogs } = require('../controller/journal')
const { isLoggedIn } = require('../middlewares')

router.route('/compose')
    .post(isLoggedIn,createJournal)
    .get(isLoggedIn,renderCompose)

router.route('/blog/:id')
    .get(isLoggedIn,renderBlog)

router.route('/blogs')
    .get(isLoggedIn,renderBlogs)

module.exports = router;