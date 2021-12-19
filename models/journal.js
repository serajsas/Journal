const mongoose = require('mongoose');
const { encrypt } = require('../utils/crypto');

const journalSchema = new mongoose.Schema({
    body: {
        type: String,
        required: [true, 'Journal body cannot be blank']
    },
    date: {
        type: Date,
        default: new Date().toLocaleDateString().split('T')[0]
    },
    title: {
        type: String,
        required: [true, 'Title cannot be blank']
    },
});

journalSchema.statics.findJournalByID = async function (id) {
    const journal = await this.findById(id);
    return journal == null ? null : journal;
}


journalSchema.pre('save', function (next) {
    if (!this.isModified('body')) return next();
    next();
})

module.exports = mongoose.model('Journal', journalSchema);
