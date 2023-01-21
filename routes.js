const express = require("express");
const router = express.Router();
const BlogPost = require('./schema');
const path = require('path');


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

// enable client-side routing via react-router-dom by directing all unrecognised
// route requests to index.html
router.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
})

module.exports = router;