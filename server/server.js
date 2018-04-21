let mongoose = require('mongoose')

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


