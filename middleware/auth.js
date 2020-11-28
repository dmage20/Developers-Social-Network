const jwt = require('jsonwebtoken')
const User = require('../models/user')
const config = require('config')


const auth = async ( req, res, next )=> {
try{    
    const token = (req.header('Authorization')).replace('Bearer ', '')
    const tokenKey = config.get("tokenKey")
    const decoded = jwt.verify(token, tokenKey)
    const user = await User.findOne({_id: decoded._id, 'tokens.token':token})
    if (!user){
        throw new Error()
    }
    req.token = token
    req.user = user
    next()
} catch (error) {
    res.status(401).send({error: 'Please authenticate'})
}
}

module.exports = auth