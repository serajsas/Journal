const express = require('express');
const router = express.Router();
const { createJournal, renderCompose, renderBlog, renderBlogs, renderEditBlog,updateJournal } = require('../controller/journal')
const { isLoggedIn } = require('../middlewares')

router.route('/compose')
    .post(isLoggedIn, createJournal)
    .get(isLoggedIn, renderCompose)

router.route('/compose/edit/:id')
    .get(isLoggedIn, renderEditBlog)
    .post(isLoggedIn, updateJournal)

router.route('/blog/:id')
    .get(isLoggedIn, renderBlog)

router.route('/blogs')
    .get(isLoggedIn,renderBlogs)

module.exports = router;