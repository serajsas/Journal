
const journal = require('../models/journal');
const Journal = require('../models/journal');
const User = require('../models/user');
const { encryptJournal, decryptJournal,decrypt } = require('../utils/crypto')



const createJournal = async function (req, res) {
    const journal = new Journal(req.body);
    encryptJournal(journal);
    await User.findOneAndUpdate({ _id: req.session.loggedIn }, { $push: { blogs: journal } })
    return res.redirect(`/blog/${journal._id}`);
}


const deleteJournal = async function (req, res) {
    await User.findOneAndUpdate({ _id: req.session.loggedIn }, { $pull: { blogs: { _id: req.params.id } } })
    return res.redirect('/blogs')

}
const renderCompose = function (req, res) {
    return res.render('./pages/compose', { journal: false })
}

const renderEditBlog = async function (req, res) {
    const user = await User.findUser(req.session.username);
    const journal = user.blogs.find((blog) => blog._id == req.params.id)
    decryptJournal(journal);
    return res.render('./pages/editBlog', { journal })

}

const updateJournal = async function (req, res) {
    const user = await User.findUser(req.session.username);
    const journal = user.blogs.find((blog) => blog._id == req.params.id)
    journal.body = req.body.body;
    journal.title = req.body.title;
    journal.date = new Date().toLocaleDateString().split('T')[0];
    encryptJournal(journal)
    await user.save();
    return res.redirect(`/blog/${journal._id}`)

}

const renderBlog = async function (req, res) {
    const user = await User.findUser(req.session.username);
    const journal = user.blogs.find((blog) => blog._id == req.params.id)
    decryptJournal(journal);
    return res.render('./pages/blog', { journal })
}

const renderBlogs = async function (req, res) {
    const user = await User.findUser(req.session.username);
    let journals = user.blogs.map(journal => {
        return {
            _id: journal._id,
            title: decrypt(journal.title),
            body: decrypt(journal.body),
            date: journal.date
        }
    })
    return res.render("./pages/blogs", { name: req.session.username, journals, message: false });
}


module.exports = { createJournal, renderCompose, renderBlog, renderBlogs, renderEditBlog, updateJournal, deleteJournal }