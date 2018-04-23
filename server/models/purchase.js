let mongoose = require('mongoose')

let Purchase = mongoose.model('Purchase', {
    clientId: {
        type: String,
        required: true
    },

    text: {
        type: String,
        required: true,
        minlength: 5,
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


module.exports = {Purchase}