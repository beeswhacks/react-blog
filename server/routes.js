const express = require("express");
const router = express.Router();
const BlogPost = require('./schema');

router.get('/', (res) => {
    res.send('Hello world.');
})

router.get('/blogPosts', (res) => {
    BlogPost.find({}, (err, result) => {
        if (err) {
            throw new Error(err);
        }
        if (result) {
            res.json(result);
        }
    })
});

router.post('/newPost', (res) => {
    // TO DO
    res.send('TBC.');
});

router.put('/editPost/:id', (res) => {
    // TO DO
    res.send('TBC.');
})

module.exports = router;