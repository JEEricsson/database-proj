const expect = require('expect')
const request = require('supertest')

const {app} = require('./../server')
const {Purchase} = require('./../models/purchase')
const {User} = require('./../models/user')
const {purchases, populatePurchases, users,populateUsers} = require('./seedTest.js')


beforeEach(populatePurchases)
beforeEach(populateUsers) 



describe('POST /purchases', () => {
    it('creating a new purchase', (done) => {
        let text = 'Inserting test'
        let clientId = users[0]._id.toHexString()
        let price = 34
        

        request(app)
        .post('/purchases')
        .set('my-auth', users[0].tokens[0].token)
        .send({text, clientId, price})
        .expect(200)
        .expect((res) => {
            expect(res.body.text).toBe(text)
            expect(res.body.clientId).toBe(clientId)
            expect(res.body.price).toBe(price)
        })
        .end((err, res) => {
            if (err){
                return done(err)
            }

            Purchase.find({text}).then((purchases) => {
                expect(purchases.length).toBe(1)
                expect(purchases[0].text).toBe(text)
                done()
            }).catch((e) => done(e))
        })
    })

    it('Should not create a purchase that is not valid', (done) => {
        request(app)
        .post('/purchases')
        .set('my-auth', users[0].tokens[0].token)
        .send({})
        .expect(400)
        .end((err) => {
        if (err){
            return done(err)
        }
    })
        Purchase.find().then((purchases) => {
            expect(purchases.length).toBe(2)
            done()
        }).catch((e) => done(e))
    })   
})
describe ('GET /purchases', () => {
    it('Getting all the purchases  ', (done) => {
        request(app)
            .get('/purchases')
            .set('my-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.purchases.length).toBe(1)
            })
            .end(done)
    })
})

describe ('Get /users/currentUser', () => {
    it('return user if authenticated', (done) => {
        request(app)
            .get('/users/currentUser')
            .set('my-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString())
                expect(res.body.email).toBe(users[0].email)
            })
            .end(done)
    })
    it('return 401 if user not authenticated', (done) => {
        request(app)
        .get('/users/currentUser')
        .expect(401)
        .expect((res) => {
            expect(res.body).toEqual({})
            
        })
        .end(done)
    })
    
})

describe('POST /users', () =>{
    it('create a user', (done) => {
        let email = 'test1@mail.com'
        let password = 'testPass'

        request(app)
        .post('/users')
        .send({email,password})
        .expect(200)
        .expect((res) => {
            expect(res.headers['my-auth']).toBeTruthy()
            expect(res.body._id).toBeTruthy()
            expect(res.body.email).toBe(email)
        })
        .end((err) => {
            if (err){
                return done(err)
            }
            User.findOne({email}).then((user) => {
                expect(user).toBeTruthy()
                expect(user.password).not.toBe(password)
                done()
            })
        })

    })
    it('validation errors', (done) => {
        let email = 'test1mail.com'
        let password = 'teas'

        request(app)
        .post('/users')
        .send({email,password})
        .expect(400)
        .end((err) => {
            
        done()
        })

    })
    it('not create a user if the email is used', (done) => {
       
        request(app)
        .post('/users')
        .send({email: users[0].email,password:'teasssdsd'})
        .expect(400)

        done()
    })
})
