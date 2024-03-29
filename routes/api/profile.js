const express = require('express')
const { check, validationResult } = require('express-validator')
const auth = require('../../middleware/auth')
const Profile = require('../../models/Profile')
const User = require('../../models/User')
const Post = require('../../models/Post')
const router = express.Router()
const config = require('../../config/default.json')
const request = require('request')
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
    //@todo - remove user posts
    await Post.deleteMany({ user: req.user.id })
    //remove profile
    await Profile.findOneAndDelete({ user: req.user.id })
    //remove user
    await User.findOneAndDelete({ _id: req.user.id })
    res.json({ msg: 'User removed' })
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server Error')
  }
})
//@route PUT api/profile/experience
//@desc add profile experience
//@access Private
router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'Title is required!').not().isEmpty(),
      check('company', 'Company is required!').not().isEmpty(),
      check('from', 'From date is required!').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }
      const { title, company, from, to, location, current, description } =
        req.body
      const newExp = {
        title,
        company,
        from,
        to,
        location,
        current,
        description,
      }
      try {
        const profile = await Profile.findOne({ user: req.user.id })
        profile.experience.unshift(newExp)
        await profile.save()
        res.json({ profile })
      } catch (error) {
        console.error(error.message)
        res.status(500).json({ msg: 'Server Error' })
      }
    } catch (error) {
      console.error(error.message)
      res.status(500).json({ msg: 'Server Error' })
    }
  }
)
//@route DELETE api/profile/experience/:experience_id
//@desc delete profile experience
//@access Private
router.delete('/experience/:experience_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id })
    console.log({ profile })
    //get remove index
    const removeIndex = profile.experience
      .map((it) => it.id)
      .indexOf(req.params.experience_id)
    profile.experience.splice(removeIndex, 1)
    await profile.save()
    res.json(profile)
  } catch (error) {
    console.error(error)
    res.status(500).send('Server Error')
  }
})
//@route PUT api/profile/education
//@desc add profile education
//@access Private
router.put(
  '/education',
  [
    auth,
    [
      check('school', 'School is required!').not().isEmpty(),
      check('degree', 'Degree is required!').not().isEmpty(),
      check('from', 'From date is required!').not().isEmpty(),
      check('fieldOfStudy', 'Field of Study is required!').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }
      const { school, degree, fieldOfStudy, from, to, current, description } =
        req.body
      const newEducation = {
        school,
        degree,
        fieldOfStudy,
        from,
        to,
        current,
        description,
      }
      try {
        const profile = await Profile.findOne({ user: req.user.id })
        profile.education.unshift(newEducation)
        await profile.save()
        res.json({ profile })
      } catch (error) {
        console.error(error.message)
        res.status(500).json({ msg: 'Server Error' })
      }
    } catch (error) {
      console.error(error.message)
      res.status(500).json({ msg: 'Server Error' })
    }
  }
)
//@route DELETE api/profile/education/:education_id
//@desc delete profile education
//@access Private
router.delete('/education/:education_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id })
    console.log({ profile })
    //get remove index
    const removeIndex = profile.education
      .map((it) => it.id)
      .indexOf(req.params.education_id)
    if (removeIndex > -1) {
      profile.education.splice(removeIndex, 1)
      await profile.save()
      res.json(profile)
    } else {
      return res.status(400).send('Id not found Error')
    }
  } catch (error) {
    console.error(error)
    res.status(500).send('Server Error')
  }
})
//@route DELETE api/profile/github/:username
//@desc get user repos from github
//@access public
router.get('/github/:username', (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config['githubClientId']}&client_secret=${config['githubSecret']}}`,
      method: 'GET',
      headers: { 'user-agent': 'node-js' },
    }
    request(options, (error, response, body) => {
      if (error) console.error(error)
      if (response.statusCode !== 200) {
        return res.status(404).json({ msg: 'No profile found' })
      }
      res.json(JSON.parse(body))
    })
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server Error')
  }
})
module.exports = router
