const supertest = require("supertest")
import { app } from '../src/server'
import { mockDatabase, closeDatabase } from './utillity/mockDatabase'

let server: any
let request: any
let token: any

beforeAll(async () => {
    await mockDatabase();
    server = app.listen(2028);
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

describe('happenings', () => {
    it('returns all happenings', async (done) => {
        request
            .post("/graphql")
            .send({
                query: `
                { 
                    happenings {
                        id
                        title
                        emoji
                        description
                        host {
                            id
                        } 
                        participants {
                            id
                        }
                        location {
                            type
                            geometry {
                                type
                                coordinates
                            }
                            properties {
                                name
                            }
                        }
                    }
                }`
            })
            .set("Accept", "application/json")
            .set('credentials', 'include')
            .set('Authorization', `Bearer ${token}`)
            .expect("Content-Type", /json/)
            .expect(200)
            .end((err: any, res: any) => {
                if (err) {
                    console.error(res.error)
                    return done(err)
                }
                expect(res.body).toBeInstanceOf(Object)
                expect(res.body.data.happenings).toBeInstanceOf(Array)
                expect(res.body.data.happenings.length).toBe(2)
                expect(res.body.data.happenings[0]).toBeInstanceOf(Object)
                expect(res.body.data.happenings[0].id).toBe('700000000000000000000001')
                expect(res.body.data.happenings[0].title).toBe('A Very Fun Happening')
                expect(res.body.data.happenings[0].emoji).toBe('🍺🍽')
                expect(res.body.data.happenings[0].description).toBe('This is a Very Fun Happening Description')
                expect(res.body.data.happenings[0].host).toBeInstanceOf(Object)
                expect(res.body.data.happenings[0].host.id).toBe('000000000000000000000001')
                expect(res.body.data.happenings[0].participants).toBeInstanceOf(Array)
                expect(res.body.data.happenings[0].participants.length).toBe(2)
                expect(res.body.data.happenings[0].participants[0].id).toBe('000000000000000000000001')
                expect(res.body.data.happenings[0].participants[1].id).toBe('000000000000000000000002')
                expect(res.body.data.happenings[0].location).toBeInstanceOf(Object)
                expect(res.body.data.happenings[0].location.type).toBe('Feature')
                expect(res.body.data.happenings[0].location.geometry).toBeInstanceOf(Object)
                expect(res.body.data.happenings[0].location.geometry.type).toBe('Point')
                expect(res.body.data.happenings[0].location.geometry.coordinates).toEqual([125.6, 10.1])
                expect(res.body.data.happenings[0].location.properties).toBeInstanceOf(Object)
                expect(res.body.data.happenings[0].location.properties.name).toBe('Dinagat Islands')

                expect(res.body.data.happenings[1]).toBeInstanceOf(Object)
                expect(res.body.data.happenings[1].id).toBe('700000000000000000000002')
                expect(res.body.data.happenings[1].title).toBe('A New Very Fun Happening')
                return done()
            })
    })
    it('returns 401 - Unathorized when token is not provided', async (done) => {
        request
            .post("/graphql")
            .send({
                query: '{ happenings { id } }'
            })
            .set("Accept", "application/json")
            .expect(401)
            .end(done)
    })
})