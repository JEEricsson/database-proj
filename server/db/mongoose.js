let mongoose = require('mongoose')
require('mongoose-type-email')

mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGODB_URI)

module.exports = {mongoose}