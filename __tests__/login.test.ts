const supertest = require("supertest")
import {app} from '../src/server'
import { mockDatabase, closeDatabase } from './utillity/mockDatabase'

let server: any
let request: any

beforeAll(async () => {
    await mockDatabase()
    server = app.listen(2020)
    request = supertest(server)
});

afterAll(async () => {
    await closeDatabase()
    await server.close()
});

describe('/login', () => {
    it('logs in user and responds with 200 when user in database', async (done) => {
        request
            .post('/login')
            .send({
                email: 'test@test.se',
                password: 'password',
            })
            .set("Content-Type", "application/json")
            .expect(200)
            .end(done)
    });

    it('returns id on login', async (done) => {
        request
            .post('/login')
            .send({
                email: 'johndoe@test.se',
                password: 'password123',
            })
            .set("Content-Type", "application/json")
            .expect(200)
            .end((err: any, res: any) => {
                if(err) return done(err)
                expect(res.body.id).toBe('000000000000000000000002')
                expect(res.body.name).toBe('John Doe')
                expect(res.body.email).toBe('johndoe@test.se')
                return done()
            })
    });

    it('responds with 401 Unauthorized for bad password', async (done) => {
        request
            .post('/login')
            .send({
                email: 'johndoe@test.se',
                password: 'badpassword',
            })
            .set("Content-Type", "application/json")
            .expect(401)
            .end(done)
    });
    
    it('responds with 401 Unauthorized for bad username', async (done) => {
        request
            .post('/login')
            .send({
                email: 'notauser@test.se',
                password: 'password123',
            })
            .set("Content-Type", "application/json")
            .expect(401)
            .end(done)
    });
})