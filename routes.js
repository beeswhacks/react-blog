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

router.get('/api/getPost/:id', (req, res) => {
    BlogPost.findById(req.params.id, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Cannot find post with ID ', req.params.id,'./n', err);
        };
        if (result) {
            res.json(result);
        };
    });
})

router.put('/api/editPost', (req, res) => {
    console.log('Request received with body: ', req.body);
    BlogPost.findByIdAndUpdate(req.body.id, 
        { $set: {
            title: req.body.title,
            author: req.body.author,
            content: req.body.content,
            dateCreated: Date.now()
        }},
        (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).send('Could not update post: ', err);
            }
            if (result) {
                res.status(200).json(result);
            }
        }
    );
})

// enable client-side routing via react-router-dom by directing all unrecognised
// route requests to index.html
router.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
})

module.exports = router;