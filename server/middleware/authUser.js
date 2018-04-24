let {User} = require('./../models/user')

let authUser = (req, res, next) => {
    let token = req.header('my-auth')

    User.findByToken(token).then((user) => {
        if (!user) {
            return Promise.reject()
        }

       req.user = user
       req.token = token
       next()
    }).catch((e) => {
        res.status(401).send()
    })
}
module.exports = {authUser}