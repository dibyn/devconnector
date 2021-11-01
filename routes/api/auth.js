const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../../models/User')
const config = require('../../config/default.json')
const auth = require('../../middleware/auth')
//@route GET api/auth
//@desc Test route
//@access Public
router.get('/', auth, async (req, res) => {
  try {
    console.log({req: req.user})
    const user = await User.findById(req.user.id).select('-password')
    console.log({user})
    if(!user){
      return res.status(400).send(`User not found: ${req.user.id}`)
    }
    res.json(user)
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server error')
  }
})
//@route POST api/auth
//@desc Authenticate user and get token
//@access Public
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required!').exists(),
  ],
  async (req, res) => {
    const { password, email } = req.body
    try {
      let user = await User.findOne({ email }) // findOne finds User with params
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] })
      }
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] })
      }
      const payload = {
        user: {
          id: user.id,
        },
      }
      jwt.sign(
        payload,
        config['jwtSecret'],
        { expiresIn: 3600000 },
        (error, token) => {
          if (error) throw error
          res.json({ token })
        }
      )
    } catch (error) {
      console.log(error.message)
      res.status(500).send('Server Error')
    }
  }
)
module.exports = router
