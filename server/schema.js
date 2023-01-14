const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
    author: 'string',
    title: 'string',
    dateCreated: {type: 'date', default: Date.now()},
    content: 'string'
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

module.exports = BlogPost;