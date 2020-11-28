const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('config')
const Profile = require('../models/profile')


userSchema = mongoose.Schema({
    name:{
        type: String,
        require: true,
        trim: true,
        validate(value){
            if(validator.isEmpty(value)){
                throw new Error('Name is required')
            }
        }
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid email')
            }
        }
    }, 
    password: {
        type: String,
        required: true, 
        trim: true,
        validate(value){
            if(!validator.isLength(value,{min:6})){
                throw new Error('Password must be at least 6 characters long')
            }
        }
    },
    avatar: {
        type: String
    }, 
    tokens: [{
        token:{
            type: String,
            required: true

        }
    }],
    date: {
        type: Date,
        default: Date.now
      }
},{
    timestamps: true
})
// Encrypt password before savinf id password is modified
userSchema.pre('save', async function (next) {
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }
    next()
})
// Remove sensitive data before returning user
userSchema.methods.toJSON =  function (){
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    // delete userObject.avatar
    return userObject
}
// Login user with credentials
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email})
    if (!user){
        throw new Error('Unable to login')

    }
    const match = await bcrypt.compare(password, user.password)
    if(!match){
        throw new Error('Unable to login')
    }
    return user
}
userSchema.methods.generateAuthToken = async function (){
    const user = this
    const tokenKey = config.get("tokenKey")
    const token = jwt.sign({_id: user._id.toString()}, tokenKey, { expiresIn: '24h' })
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}
// userSchema.pre('remove', async function(next) {
//     const user = this
//     await Profile.findOneAndRemove({user: user._id})
//     // await Post.deleteMany({user: user._id})
//     next()
// })
const User = mongoose.model('user', userSchema)

module.exports = User