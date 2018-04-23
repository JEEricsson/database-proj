let mongoose = require('mongoose')
const jswt = require('jsonwebtoken')
const _ = require('lodash')

let = UserSchema = new mongoose.Schema({
    email: {
        type: mongoose.SchemaTypes.Email,
        require: true,
        trim: true,
        unique: true
        },
    password:{
        type: String,
        require: true,
        minlength: 7,
        trim: true
    },
    tokens: [{
        access: {
           type: String,
           require: true
        },
        token: {
           type: String,
           require: true
        }
    }]    
})

UserSchema.methods.toJSON = function () {
    let user = this
    let userObject = user.toObject()

    return _.pick(userObject, ['_id', 'email'])
}

UserSchema.methods.generateAuthToken = function () {
    let user = this
    let access = 'auth'
    let token = jswt.sign({_id: user._id.toHexString(), access}, '74dv6').toString()

    user.tokens = user.tokens.concat([{access, token}])

    return user.save().then(() =>{
        return token
    })
}

let User = mongoose.model('User', UserSchema)
    


module.exports = {User}

