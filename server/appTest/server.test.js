const expect = require('expect')
const request = require('supertest')

const {app} = require('./../server')
const {Purchase} = require('./../models/purchase')

beforeEach((done) => {  //!!!! Warning !!!!Don´t use this test on your production database. It will whipe it clean.....
    Purchase.remove({}).then(() => done())
})

describe('POST /purchases', () => {
    it('creating a new purchase', (done) => {
        let text = 'Inserting test'
        let clientId = '3457dfwsw3'
        let price = 34
        

        request(app)
        .post('/purchases')
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

            Purchase.find().then((purchases) => {
                expect(purchases.length).toBe(1)
                expect(purchases[0].text).toBe(text)
                done()
            }).catch((e) => done(e))
        })
    })

    it('Should not create a purchase that is not valid', (done) => {
        request(app)
        .post('/purchases')
        .send({})
        .expect(400)
        .end((err) => {
        if (err){
            return done(err)
        }
    })
        Purchase.find().then((purchases) => {
            expect(purchases.length).toBe(0)
            done()
        }).catch((e) => done(e))
    })   
})