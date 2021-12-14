const mongoose = require('mongoose')

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

module.exports = mongoose.model('Journal', journalSchema);
