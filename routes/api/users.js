const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
//@route POST api/users
//@desc Register user
//@access Public
const User = require('../../models/User')
const jwt = require('jsonwebtoken')
const config = require('../../config/default.json')
router.post(
  '/',
  [
    check('name', 'Name is required!').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const { name, password, email } = req.body
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    try {
      // See if user exists
      let user = await User.findOne({ email: email }) // findOne finds User with params
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] })
      }
      // Get users gravatar
      const avatar = gravatar.url(email, {
        s: '200', // string length
        r: 'pg', // rating
        d: 'mm',
      })
      user = new User({
        name,
        email,
        avatar,
        password,
      })
      // Encrypt password using bcrypt
      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(password, salt)
      await user.save()
      // return jsonwebtoken
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
