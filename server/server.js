require('./config/conf')

const _ = require('lodash')
let {ObjectID} = require('mongodb')

let express = require('express')
let body_Parser = require('body-parser')

let {mongoose} = require('./db/mongoose')
let {Purchase} = require('./models/purchase')
let {User} = require('./models/user')
let {authUser} = require('./middleware/authUser')

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
  
    let body = _.pick(req.body, ['email', 'password'])
    let user = new User(body)

    user.save().then(() => {
        return user.generateAuthToken()

    }).then((token) => {
        res.header('my-auth', token).send(user)
    }).catch ((e) => {
        res.status(400).send(e)
     })
    })

    app.get('/purchases', (req, res) => {
        Purchase.find().then((purchases) => {
            res.send({purchases})
        }, (e) => {
            res.status(400).send(e)
        })
    })

    app.get('/purchases/:id', (req, res) => {
        let id = req.params.id
        
        if (!ObjectID.isValid(id)){
             return res.status(404).send()
         } 
        Purchase.findById(id).then((purchase) => {
                if (!purchase){
                     return res.status(404).send('Item not found')
                }
                     res.send({purchase})
           }).catch((e) => {
               res.status(400).send()
           })
       
    })

    app.delete('/purchases/:id', (req, res) => {
        let id = req.params.id
        if (!ObjectID.isValid(id)){
            return res.status(404).send()
        }
        Purchase.findByIdAndRemove(id).then((purchase) => {
            if (!purchase){
                return res.status(404).send('Item not found')
            }
            res.send(`Removed item \n ${purchase} \n from the database`)
        }).catch((e) => {
            res.status(400).send()
        })
    })
    
    app.patch('/purchases/:id', (req, res) => {
        let id = req.params.id
        let body = _.pick(req.body, ['text', 'active'])
        if (!ObjectID.isValid(id)){
            return res.status(404).send()
        }
        if (_.isBoolean(body.active) && body.active) {
            body.completedAt = new Date()
        }else{
            body.active = false
            body.completedAt = null
        }
        Purchase.findByIdAndUpdate(id, {$set: body}, {new: true}).then((purchase) => {
        if (!purchase){
            return res.status(404).send()
        }
        res.send({purchase})
        }).catch((e) => {
            res.status(400).send()
        })

    })

    
    app.get('/users/currentUser', authUser, (req, res) => {
        res.send(req.user)
    })

    app.post('/users/login',(req, res) => {
        let body = _.pick(req.body, ['email', 'password'])
        
        User.findByBody(body.email, body.password).then((user) => {
            res.send(user)
        }).catch((e) => {
            res.status(400).send()
        })
    })

app.listen(3000, () => {
    console.log('Server started on port 3000')
})

module.exports = {app} 