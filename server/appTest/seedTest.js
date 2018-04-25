const {ObjectID} = require('mongodb')
const jswt = require('jsonwebtoken')
const {Purchase} = require('./../models/purchase')
const {User} = require('./../models/user')

const firstUser = new ObjectID
const secondUser = new ObjectID

const users = [{
    _id: firstUser,
    email: 'jean-e1@mail.com',
    password: 'password1',
    tokens: [{
        access: 'auth',
        token: jswt.sign({_id: firstUser, access: 'auth'}, '74dv6').toString()
      }]
    },{
    _id: secondUser,
    email: 'jean-e2@mail.com',
    password: 'password2',
    tokens: [{
        access: 'auth',
        token: jswt.sign({_id: secondUser, access: 'auth'}, '74dv6').toString()
    }]
    
        }]
const purchases = [{
    _id: new ObjectID(),
    text: 'Test purchase',
    active: true,
    clientId: firstUser,
    price:23
},{
    _id: new ObjectID(),
    text: 'Test2 purchase',
    active: true,
    clientId: secondUser,
    price:20
}]
const populateUsers = (done) => {
    User.remove({}).then(() => {
        let firstUser = new User(users[0]).save()
        let secondUser = new User(users[1]).save()

        return Promise.all([firstUser,secondUser])
    }).then(() => done())
}

const populatePurchases = (done) => {
    Purchase.remove({}).then(() => {
    Purchase.insertMany(purchases)       
}).then(() => done())

}

module.exports = {purchases, populatePurchases, users, populateUsers}
