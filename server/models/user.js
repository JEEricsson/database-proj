let mongoose = require('mongoose')
const jswt = require('jsonwebtoken')
const _ = require('lodash')
const bcryptjs = require('bcryptjs')

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

UserSchema.statics.findByToken = function (token) {
    let User = this
    let decoded

    try{
        decoded = jswt.verify(token, '74dv6')
     } catch (e){
        // return new Promise((resolve, reject) => {
        //     reject()
        // })
        return Promise.reject() 
     }

      return User.findOne({
          '_id': decoded._id,
          'tokens.token': token, 
          'tokens.access': 'auth'
      })
    
}

UserSchema.pre('save', function (next) {

    let user = this

    if (user.isModified('password')){
        bcryptjs.genSalt(10, (err, salt) => {
            bcryptjs.hash(user.password, salt, (err, hash) => {
                user.password = hash
                next()
            })
          })
    } else {
        next()
    }
})

let User = mongoose.model('User', UserSchema)
    


module.exports = {User}

