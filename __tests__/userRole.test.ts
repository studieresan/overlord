const supertest = require("supertest")
import { app } from '../src/server'
import { mockDatabase, closeDatabase } from './utillity/mockDatabase'

let server: any
let request: any
let token: any

beforeAll(async () => {
    await mockDatabase();
    server = app.listen(2027);
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

describe('userRoles', () => {
    it('returns all userRoles', async (done) => {
        request    
            .post("/graphql")
            .send({
                query: `
                {
                    userRoles
                }`
            })
            .set("Accept", "application/json")
            .set('credentials', 'include')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    console.error(res.body)
                    return done(err)
                }
                expect(res.body).toBeInstanceOf(Object)
                expect(res.body.data.userRoles).toBeInstanceOf(Array)
                expect(res.body.data.userRoles).toEqual([
                    'project_manager',
                    'event_group',
                    'finance_group',
                    'info_group',
                    'it_group',
                    'sales_group',
                    'travel_group',
                ])
                return done()
            })
    })
})