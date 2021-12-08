const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    body: {
        type: String,
        required: [true, 'Post body cannot be blank']
    },
    date: {
        type: Date,
        required: [true, 'Date cannot be blank']
    },
  });
    
  module.exports = mongoose.model('Post', postSchema);
