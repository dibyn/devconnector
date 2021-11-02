const express = require('express')
const { check, validationResult } = require('express-validator')
const auth = require('../../middleware/auth')
const Profile = require('../../models/Profile')
const User = require('../../models/User')
const router = express.Router()
//@route GET api/profile/me
//@desc Get current users profile
//@access Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name', 'avatar']
    )
    if (!profile) {
      return res.status(400).json({ msg: 'No profile found' })
    }
    res.json(profile)
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server Error')
  }
})
//@route POST api/profile
//@desc Create or Update current users profile
//@access Private
router.post(
  '/',
  [
    auth,
    check('status', 'Status is required').not().isEmpty(),
    check('skills', 'Skills is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body
    // build profile object
    const profileFields = {}
    profileFields.user = req.user.id
    if (company) profileFields.company = company
    if (website) profileFields.website = website
    if (location) profileFields.location = location
    if (bio) profileFields.bio = bio
    if (status) profileFields.status = status
    if (githubusername) profileFields.githubusername = githubusername
    if (skills) {
      profileFields.skills = skills.split(',').map((s) => s.trim())
    }
    //  Build social object
    profileFields.social = {}
    if (youtube) profileFields.social.youtube = youtube
    if (facebook) profileFields.social.facebook = facebook
    if (twitter) profileFields.social.twitter = twitter
    if (linkedin) profileFields.social.linkedin = linkedin
    if (instagram) profileFields.social.instagram = instagram
    try {
      let profile = await Profile.findOne({ user: req.user.id })
      if (profile) {
        // update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        )
        return res.json(profile)
      }
      // Create
      profile = new Profile(profileFields)
      await profile.save()
      res.json(profile)
    } catch (error) {
      console.log(error)
      res.status(500).send('Server Error')
    }
    res.send('Hello')
  }
)
//@route GET api/profile
//@desc get all profile
//@access Public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar'])
    console.log({ profiles })
    res.json(profiles)
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server Error')
  }
})
//@route GET api/profile/user/:user_id
//@desc get profile by id
//@access Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar'])
    if (!profile) return res.status(400).json({ msg: 'Profile not found' })
    return res.json(profile)
  } catch (error) {
    console.error(error.message)
    if (error.kind === 'ObjectId')
      return res.status(400).json({ msg: 'Profile not found' })
    res.status(500).send('Server Error')
  }
})
//@route DELETE api/profile
//@desc delete profile, user and posts
//@access Private
router.delete('/', auth, async (req, res) => {
  try {
    //@todos - remove user posts

    //remove profile
    await Profile.findOneAndDelete({ user: req.user.id })
    //remove user
    await User.findOneAndDelete({ _id: req.user.id })
    res.json({ msg: 'User removed'})
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server Error')
  }
})
module.exports = router
