const express = require('express')
const router = express.Router()
const User = require('../../models/user')
const gravatar = require('gravatar')
const auth = require('../../middleware/auth')

router.post('/api/users', async (req, res)=> {
    try {
        const user = new User(req.body)
        const avatar = gravatar.url(user.email,{
            s: '200',
            r: 'pg',
            d:'mm'
        })
        user.avatar = avatar
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({token})
    } catch (e){
        if (e.name === 'MongoError' && e.code === 11000) {
            return res.status(400).send([{
                error: {
                    name: 'email',
                    message: `${req.body.email} is already in use`
                }
            }])
        }
        const arrayOfErrors = Object.entries(e.errors).map( error => ( 
            {error:{
                name: error[0],
                message:error[1].message
            }} 
            ) )
        res.status(500).send(arrayOfErrors)
    }
})

router.get('/api/users/me', auth, async (req, res)=>{

    res.send(req.user)
})

module.exports = router