const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const { check, validationResult } = require('express-validator')
const Post = require('../../models/Post')
const Profile = require('../../models/Profile')
const User = require('../../models/User')
//@route POST api/posts
//@desc Create a post
//@access Private
router.post(
  '/',
  [auth, [check('text', 'Text is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    try {
      const user = await User.findById(req.user.id).select('-password')
      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      })
      const post = await newPost.save()
      res.json(post)
    } catch (error) {
      console.error(error.message)
      res.status(500).send('Server Error')
    }
  }
)
//@route Get api/posts
//@desc get all post
//@access Private
router.get('/', auth, async (req, res) => {
  try {
    const post = await Post.find().sort({ date: -1 })
    res.json(post)
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server Error')
  }
})
//@route Get api/posts/:id
//@desc get post by id
//@access Private
router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' })
    }
    res.json(post)
  } catch (error) {
    console.error(error.message)
    if (error.kind === 'ObjectId') {
      res.status(404).json({ msg: 'Post not found' })
    }
    res.status(500).send('Server Error')
  }
})
//@route Delete api/posts/:id
//@desc delete post by id
//@access Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' })
    }
    //check on the user is valid or not
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' })
    }
    await post.remove()
    res.json({ msg: 'Post removed' })
  } catch (error) {
    console.error(error.message)
    if (error.kind === 'ObjectId') {
      res.status(404).json({ msg: 'Post not found' })
    }
    res.status(500).send('Server Error')
  }
})
//@route PUT api/posts/like/:id
//@desc like a post
//@access Private
router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    //check on the user is valid or not
    // if (post.user.toString() !== req.user.id) {
    //   return res.status(401).json({ msg: 'User not authorized' })
    // }
    //check if there is post or not
    // if (!post) {
    //   return res.status(404).json({ msg: 'Post not found' })
    // }
    //check if post has already been liked
    console.log({ post })
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: 'Post already liked' })
    }

    post.likes.unshift({ user: req.user.id })
    await post.save()
    res.json(post.likes)
  } catch (error) {
    console.error(error.message)
    if (error.kind === 'ObjectId') {
      res.status(404).json({ msg: 'Post not found' })
    }
    res.status(500).send('Server Error')
  }
})
//@route PUT api/posts/like/:id
//@desc like a post
//@access Private
router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    //check on the user is valid or not
    // if (post.user.toString() !== req.user.id) {
    //   return res.status(401).json({ msg: 'User not authorized' })
    // }
    //check if there is post or not
    // if (!post) {
    //   return res.status(404).json({ msg: 'Post not found' })
    // }
    //check if post has already been liked
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: 'Post not liked yet!' })
    }
    //get remove index
    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id)
    if (removeIndex > -1) {
      post.likes.splice(removeIndex, 1)
      await post.save()
      res.json({ msg: 'like removed' })
    } else {
      res.json({ msg: 'like not found' })
    }
  } catch (error) {
    console.error(error.message)
    if (error.kind === 'ObjectId') {
      res.status(404).json({ msg: 'Post not found' })
    }
    res.status(500).send('Server Error')
  }
})
//@route POST api/posts/comment/:id
//@desc Comment on a post
//@access Private
router.post(
  '/comment/:id',
  [auth, [check('text', 'Text is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    try {
      const user = await User.findById(req.user.id).select('-password')
      const post = await Post.findById(req.params.id)
      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      }
      post.comments.unshift(newComment)
      await post.save()
      res.json(post.comments)
    } catch (error) {
      console.error(error.message)
      res.status(500).send('Server Error')
    }
  }
)
//@route DELETE api/posts/comment/:id/:comment_id
//@desc delete comment on a post
//@access Private
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    const post = await Post.findById(req.params.id)
    //pull out comment
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    )
    //make sure comment exists
    if (!comment) {
      return res.status(404).json({ msg: 'Comment does not exist' })
    }
    //check user
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' })
    }
    //get remove index
    const removeIndex = post.comments
      .map((c) => c.user.toString())
      .indexOf(req.user.id)
    if (removeIndex > -1) {
      post.comments.splice(removeIndex, 1)
      post.save()
      res.json(post.comments)
      // res.json({ msg: `Comment deleted of ID: ${req.params.comment_id}` })
    } else {
      return res.status(404).json({ msg: 'Request Failed' })
    }
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server Error')
  }
})
module.exports = router
