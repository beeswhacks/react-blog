const express = require("express");
const router = express.Router();
const BlogPost = require('./schema');

router.get('/', (req, res) => {
    res.send('Request received to root directory of server.');
})

router.get('/blogPosts', (req, res) => {
    BlogPost.find({}, (err, result) => {
        if (err) {
            throw new Error(err);
        }
        if (result) {
            res.json(result);
        }
    }).sort({dateCreated: 'desc'})
});

router.post('/newPost', (req, res) => {
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

router.put('/editPost/:id', (req, res) => {
    // TO DO
    res.send('TBC.');
})

module.exports = router;