const supertest = require("supertest")
import { app } from '../src/server'
import { mockDatabase, closeDatabase } from './utillity/mockDatabase'

let server: any
let request: any
let token: any

beforeAll(async () => {
    await mockDatabase();
    server = app.listen(2024);
    request = await supertest(server);
});

beforeEach(async () => {
    await request
        .post('/login')
        .send({
            email: 'test@test.se',
            password: 'password',
        })
        .set("Content-Type", "application/json")
        .then(res => {
            token = res.body.token
        }) 
})

afterAll(async () => {
    await closeDatabase()
    await server.close()
});

describe('companyCreate', () => {
    it.todo('creates company')
})

describe('companyUpdate', () => {
    it.todo('updates company')
})

describe('companyDelete', () => {
    it.todo('deletes company')
})