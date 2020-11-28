const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const User = require('../../models/user')

// Login
router.post('/api/auth', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
        res.send()
    } catch(e){

        res.status(500).send([{
            error:{
                name:'validation',
                message: e.message
            }
        }])
    }
})

router.post('/api/auth/logout', auth , async (req, res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=> token.token !== req.token)
        await req.user.save()
        res.send()
    } catch (error){
        res.status(500).send()
    }
})

module.exports = router
