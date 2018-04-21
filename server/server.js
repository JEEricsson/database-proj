let mongoose = require('mongoose')
require('mongoose-type-email')

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/Econ')

let Purchase = mongoose.model('Purchase', {
    clientId: {
        type: String,
        required: true
    },

    text: {
        type: String,
        required: true,
        minlenght: 5,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0.01
        },
    completedAt: {
        type: Date,
        default: Date.now
    },
    active: {
        type: Boolean,
        default: false
    }
})

let purchase = new Purchase({
    clientId: '345345',
    text: 'Item 64',
    price: 5.00,
    active: true
}) 

purchase.save().then((doc) => {
    console.log('Saved item: ', doc)
}, (e) => {
    console.log('Cant save item', e)
})

let User = mongoose.model('User', {
    email: {
        type: mongoose.SchemaTypes.Email,
        require: true
        
    }
})

let user = new User({
    email: 'Jean@mail.com' //A valid email required 
})

user.save().then((doc) => {
    console.log('User saved ', JSON.stringify(doc, undefined, 2))
}, (e) => {
    console.log('Couldn´t save user: ', e)
})



