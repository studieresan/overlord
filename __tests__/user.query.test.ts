const supertest = require("supertest")
import { app } from '../src/server'
import { mockDatabase, closeDatabase } from './utillity/mockDatabase'
import { getUserQuery } from './utillity/userQueries'


let server: any
let request: any
let token: any

beforeAll(async () => {
    await mockDatabase();
    server = app.listen(2025);
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

describe('user', () => {
    it('returns the currently logged in user', async (done) => {
        request
            .post("/graphql")
            .send({
                query: getUserQuery
            })
            .set("Accept", "application/json")
            .set('credentials', 'include')
            .set('Authorization', `Bearer ${token}`)
            // .expect("Content-Type", /json/) //TODO - failing?
            .expect(200)
            .end((err: any, res: any) => {
                if (err) {
                    console.error(res.body)
                    return done(err)
                }
                expect(res.body).toBeInstanceOf(Object)
                expect(res.body.data.user).toBeInstanceOf(Object)
                expect(res.body.data.user.id).toBe('000000000000000000000001')
                expect(res.body.data.user.firstName).toBe('Test')
                expect(res.body.data.user.lastName).toBe('Testsson')
                expect(res.body.data.user.studsYear).toBe(2021)
                // UserInfo
                expect(res.body.data.user.info).toBeInstanceOf(Object)
                expect(res.body.data.user.info.role).toBe('it_group')
                expect(res.body.data.user.info.email).toBe('test@test.se')
                expect(res.body.data.user.info.phone).toBe('012-345 67 89')
                expect(res.body.data.user.info.linkedIn).toBe('https://www.linkedin.com/in/test-testsson/')
                expect(res.body.data.user.info.github).toBe('https://github.com/testtestsson')
                expect(res.body.data.user.info.master).toBe('AI')
                expect(res.body.data.user.info.allergies).toBe('bugs')
                expect(res.body.data.user.info.picture).toBe('linkto/imageTestsson')
                expect(res.body.data.user.info.permissions).toBeInstanceOf(Array)
                return done()
            })
    })
    it('responds with 401 - Unauthorized when user token not provided', async (done) => {
        request
            .post("/graphql")
            .send({
                query: getUserQuery
            })
            .set("Accept", "application/json")
            .expect(401)
            .end(done)
    })
    it.todo('returns cv')
})

describe('users', () => {
    it('returns a list of all users in the database', async (done) => {
        request    
            .post("/graphql")
            .send({
                query: `{users {id}}`
            })
            .set("Accept", "application/json")
            .expect(200)
            .end((err, res) => {
                if (err) {
                    console.error(res.body)
                    return done(err)
                }
                expect(res.body).toBeInstanceOf(Object)
                expect(res.body.data.users).toBeInstanceOf(Array)
                expect(res.body.data.users.length).toBe(2)
                return done()
            })
    })
    it.todo('returns only users with the specified userRole')
    it.todo('returns only users with the specified studsYear')
    it.todo('returns only users with the specified userRole and studsYear')
    it.todo('responds with 400 on a bad request')
})