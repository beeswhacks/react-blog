const express = require("express");
const router = express.Router();
const BlogPost = require('./schema');
const path = require('path');

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/build/index.html'));
})

// enable client-side routing of /newPost by serving index.html
router.get('/newPost', (req, res) => {
    res.sendFile(path.join(__dirname, 'build/index.html'));
});

router.get('/api/blogPosts', (req, res) => {
    BlogPost.find({}, (err, result) => {
        if (err) {
            throw new Error(err);
        }
        if (result) {
            res.json(result);
        }
    }).sort({dateCreated: 'desc'})
});

router.post('/api/newPost', (req, res) => {
    console.log(req.body);

    var newPost = new BlogPost({
        author: req.body.author,
        title: req.body.title,
        content: req.body.content,
        dateCreated: Date.now()
    });

    newPost.save((err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send(err);
        };
        if (result) {
            console.log('New document added: \n', result);
            res.status(201);
        };
    });
});

module.exports = router;