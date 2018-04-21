let express = require('express')
let body_Parser = require('body-parser')

let {mongoose} = require('./db/mongoose')
let {Purchase} = require('./models/purchase')
let {User} = require('./models/user')

let app = express()

app.use(body_Parser.json())

app.post('/purchases', (req, res) => { //recieving a http POST request from User
    let purchase = new Purchase({
        clientId: req.body.clientId,
        text: req.body.text,
        price: req.body.price,
        active: req.body.active
    })

    purchase.save().then((result) => {
        res.send(result)
    }, (e) => {
        res.status(400).send(e)
    })
})

app.post('/users', (req, res) => { //recieving a http POST request to create new user
    let user = new User({
        email: req.body.email
       
    })

    user.save().then((result) => {
        res.send(result)
    }, (e) => {
        res.status(400).send(e)
     })
    })



app.listen(3000, () => {
    console.log('Server started on port 3000')
})
