const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const Profile = require('../../models/profile')
const Post = require('../../models/post')
// const User = require('../../models/profile')
const request = require('request')
const config = require('config')


router.get('/api/profile/me', auth ,async(req, res)=> {
    try {
        const profile = await Profile.findOne({user: req.user.id}).populate('user',['avatar','name'])
        if (!profile){
            return res.status(400).send({error: 'No profile located'})
        }
        res.send(profile)
    } catch(error){
        res.status(500).send(error)
    }
})

// Create & Update profile route
router.post('/api/profile', auth , async (req, res)=> {

    try {
        if (req.body.skills){
            req.body.skills = req.body.skills.split(",").map(skill=> skill.trim())
        }
        let profile = await Profile.findOne({user: req.user.id})
        if(profile){
            let profile = await Profile.findOneAndUpdate(
                {user: req.user.id},
                {$set: req.body},
                {new: true}
            );
            return res.send(profile)
        }
        profile = new Profile(req.body)
        profile.user = req.user.id
        await profile.save()
        res.send(profile)
    } catch(error) {
        const errors = []
        for (var key in error.errors) {
            errors.push(error.errors[key].message)
          }

        res.status(400).send(errors)
    }
})
// Get all user profiles
router.get('/api/profiles', async (req, res)=>{
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar'])
        res.send(profiles)
    } catch (error) {
        send.status(500).send('Server error')
    }
})
// get a user profile by user id (public)
router.get('/api/profile/user/:user_id', async (req, res)=>{
    try {
        const profile = await Profile.findOne({user: req.params.user_id}).populate('user', ['name', 'avatar'])
        console.log(req.params.id)
        if(!profile){
            return res.status(400).send({error: 'Unable to find profile'})
        }
        res.send(profile)
    } catch (error) {
        if (error.kind === 'ObjectId'){
            return res.status(400).send({error: 'Unable to find profile'})
        }
        res.status(500).send(error)
    }
})

// delete a profile & user
router.delete('/api/profile', auth, async (req, res)=> {
    try {
        await Post.deleteMany({user: req.user.id})
        await Profile.findOneAndRemove({user: req.user.id})
        await req.user.remove()

        res.send('Profile Removed')
    } catch (error) {
        res.status(500).send(error)
    }
})

// Add EXPERIENCE to Profile
router.put('/api/profile/experience', auth , async (req, res)=> {
    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body
    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }
    try {
        const profile = await Profile.findOne({user: req.user.id})
        // unshift is the same as push but adds to the begining of array
        profile.experience.unshift(newExp)
        await profile.save()
        res.send(profile)
    } catch (error) {
        res.status(500).send(error)
    }
})
// Remove EXPERIENCE  from Profile
router.delete('/api/profile/experience/:exp_id', auth , async (req, res)=> {
    try {
        const profile = await Profile.findOne({user: req.user.id})
        profile.experience = profile.experience.filter((experince)=> experince.id !== req.params.exp_id)
        // experience.id is a string & experience._id is an object
        await profile.save()
        res.send(profile)
    } catch (error) {
        res.status(500).send(error)
    }
})

// Add EDUCATION to Profile
router.put('/api/profile/education', auth , async (req, res)=> {
    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    } = req.body
    const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    }
    try {
        const profile = await Profile.findOne({user: req.user.id})
        // unshift is the same as push but adds to the begining of array
        profile.education.unshift(newEdu)
        await profile.save()
        res.send(profile)
    } catch (error) {
        res.status(500).send(error)
    }
})
// Remove EDUCATION  from Profile
router.delete('/api/profile/education/:edu_id', auth , async (req, res)=> {
    try {
        const profile = await Profile.findOne({user: req.user.id})
        profile.education = profile.education.filter((education)=> education.id !== req.params.edu_id)
        // experience.id is a string & experience._id is an object
        await profile.save()
        res.send(profile)
    } catch (error) {
        res.status(500).send(error)
    }
})
// Request to github API (public)
router.get('/api/github/:username', async (req, res)=> {
    try {
        const options = {
            url: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get("githubClientId")}&client_secret=${config.get("githubSecret")}`,
            method: 'GET',
            headers: { 'user-agent': 'node.js'},
            json: true
        }
        request(options, (error, response)=> {
            if (error){
                return res.status(400).send({error: 'Github user not found'})
            }
            res.send(response.body)
        })
    } catch (error) {
        res.status(500).send(error)
    }
} )
module.exports = router