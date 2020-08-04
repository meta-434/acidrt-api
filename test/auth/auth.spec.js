require('dotenv').config();
const mocha = require('mocha');
const { expect } = require('chai');
const request = require('supertest');
const app = require('../../src/app');
const knex = require('knex');


mocha.describe('Auth Service', () => {
    let db;

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.DATABASE_URL,
        });

        app.set('db', db);
    });

    after('disconnect from db', () => db.destroy());

    it(`POST /authenticate responds as expected for valid credentials`, () => {
        return request(app)
            .post('/authenticate')
            .send({username: 'acps-employee',password: 'ilovemywatershed'})
            .set('Accept', 'application/json')
            .expect(202)
            .then(res => {
                expect(res.body).to.have.all.keys('message', 'token');
            })
    })

    it(`POST /authenticate responds as expected for invalid credentials`, () => {
        return request(app)
            .post('/authenticate')
            .send({username:"baduser", password: "badpass"})
            .set('Accept', 'application/json')
            .expect(403)
            .then(res => {
                expect(res.body).to.have.all.keys('error');
            })
    })
})