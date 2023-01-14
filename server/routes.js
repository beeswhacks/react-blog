const express = require("express");
const router = express.Router();
const BlogPost = require('./schema');

router.get('/', (req, res) => {
    res.send('Hello world.');
})

router.get('/blogPosts', (req, res) => {
    BlogPost.find({}, (err, result) => {
        if (err) {
            throw new Error(err);
        }
        if (result) {
            res.json(result);
        }
    })
});

router.post('/newPost', (req, res) => {
    // TO DO
    res.send('TBC.');
});

router.put('/editPost/:id', (req, res) => {
    // TO DO
    res.send('TBC.');
})

module.exports = router;