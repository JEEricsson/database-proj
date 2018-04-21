let mongoose = require('mongoose')

let User = mongoose.model('User', {
    email: {
        type: mongoose.SchemaTypes.Email,
        require: true,
        trim: true
        
    }
})


module.exports = {User}

