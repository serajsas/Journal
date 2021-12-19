const Journal = require('../models/journal');
const User = require('../models/user');
const { encrypt, decrypt } = require('../utils/crypto');

const createJournal = async function (req, res) {
    const journal = new Journal(req.body);
    journal.body = encrypt(journal.body);
    journal.title = encrypt(journal.title);
    await User.findOneAndUpdate({ _id: req.session.loggedIn }, { $push: { blogs: journal } })
    return res.redirect(`/blog/${journal._id}`);
}


const renderCompose = function (req, res, args = null) {
    return res.render('./pages/compose', { journal: args })
}

const renderEditBlog = async function (req, res) {
    const user = await User.findUser(req.session.username);
    const journal = user.blogs.find((blog) => blog._id == req.params.id)
    journal.body = decrypt(journal.body);
    journal.title = decrypt(journal.title);
    return res.render('./pages/editBlog', { journal })

}

const updateJournal = async function (req, res) {
    const user = await User.findUser(req.session.username);
    const journal = user.blogs.find((blog) => blog._id == req.params.id)
    journal.body = encrypt(req.body.body);
    journal.title = encrypt(req.body.title);
    journal.date = new Date().toLocaleDateString().split('T')[0];
    await user.save();
    return res.render('./pages/blog', { journal })

}

const renderBlog = async function (req, res) {
    const user = await User.findUser(req.session.username);
    const journal = user.blogs.find((blog) => blog._id == req.params.id)
    journal.body = decrypt(journal.body);
    journal.title = decrypt(journal.title);
    return res.render('./pages/blog', { journal })
}

const renderBlogs = async function (req, res) {
    const user = await User.findUser(req.session.username);
    const journals = user.blogs.map(journal => {
        return {
            _id:journal._id,
            date: journal.date,
            title: decrypt(journal.title),
            body: decrypt(journal.body)
        }
    })
    return res.render("./pages/blogs", { name: req.session.username, journals, message: false });
}


module.exports = { createJournal, renderCompose, renderBlog, renderBlogs, renderEditBlog, updateJournal }