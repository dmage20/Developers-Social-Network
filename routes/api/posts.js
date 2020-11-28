const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const User = require('../../models/user')
const Post = require('../../models/post')

// create a post (private)
router.post('/api/posts', auth, async (req, res)=> {
    try {
        const newPost = {
            text: req.body.text,
            name: req.user.name,
            avatar: req.user.avatar,
            user: req.user.id
        }
        const post = new Post(newPost)
        await post.save()
        res.send(post)
    } catch (error) {
        res.status(500).send(error)
    }
    
})
// get all posts (private)
router.get('/api/posts', auth , async (req, res)=> {
    try {
        const posts = await Post.find().sort({date: -1})
        res.send(posts)
    } catch (error) {
        res.status(500).send(error)        
    }
})
// get a posts by id (private)
router.get('/api/post/:id', auth , async (req, res)=> {
    try {
        const post = await Post.findById(req.params.id)
        if(!post){
            return res.status(404).send({error: 'Post not found'})
        }
        res.send(post)
    } catch (error) {
        if(error.kind === "ObjectId"){
            return res.status(500).send({error: 'post ID not valid'})
        }
        res.status(500).send(error)        
    }
})
// delete a posts by id (private)
router.delete('/api/post/:id', auth , async (req, res)=> {
    try {
        const post = await Post.findOne({_id: req.params.id, user: req.user._id})
        if(!post){
            return res.status(404).send({error: 'Unable to delete post'})
        }
        await post.remove()
        res.send({msg: 'Post removed'})
    } catch (error) {
        if(error.kind === "ObjectId"){
            return res.status(500).send({error: 'post ID not valid'})
        }
        res.status(500).send(error)        
    }
})
router.put('/api/post/like/:id', auth , async (req, res)=> {
    try {
        let post = await Post.findOne({_id: req.params.id, 'likes.user': req.user.id}) 
        if(post){
            post.likes = post.likes.filter((like)=> like.user.toString() !== req.user.id)
            await post.save()
            return res.send(post.likes)
        }
        post = await Post.findById(req.params.id)
        post.likes.push({user:req.user.id})
        await post.save()
        res.send(post.likes)
    } catch (error) {
        res.status(500).send(error)        
    }
})
// create a comment on a post
router.post('/api/post/comment/:id', auth, async (req, res)=> {
    try {
        const comment = {
            text: req.body.text,
            name: req.user.name,
            avatar: req.user.avatar,
            user: req.user.id
        }
        const post = await Post.findById(req.params.id)
        post.comments.unshift(comment)
        await post.save()
        res.send(post.comments)
    } catch (error) {
        res.status(500).send(error)
    }
    
})
// remove a comment on a post 
router.delete('/api/post/comment/:id/:comment_id', auth , async (req, res)=> {
    try {
        const post = await Post.findOne({ _id: req.params.id, 'comments._id': req.params.comment_id})
        if(!post){
            return res.status(500).send({error: 'Comment not found'})
        }
        const comment = post.comments.find((comment)=>comment.id.toString() === req.params.comment_id)
        if(comment.user.toString() !== req.user.id){
            return res.status(401).send({error: 'Action not authorized'})
        }
        post.comments = post.comments.filter(comment => comment.id.toString() !== req.params.comment_id)
        await post.save()
        res.send(post.comments)
    } catch (error) {
        if(error.kind === "ObjectId"){
            return res.status(500).send({error: 'Comment not found'})
        }
        res.status(500).send(error)        
    }
})
module.exports = router