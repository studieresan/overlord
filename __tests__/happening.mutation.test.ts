const supertest = require("supertest")
import { app } from '../src/server'
import { mockDatabase, closeDatabase } from './utillity/mockDatabase'
import { createHappeningMutation, updateHappeningMutation, updateLocationMutation } from './utillity/happeningQueries'

let server: any
let request: any
let token: any

beforeAll(async () => {
    await mockDatabase();
    server = app.listen(2029);
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

describe('happeningCreate', () => {
    it('creates a new happening', async (done) => {
        request
            .post("/graphql")
            .send({
                query: createHappeningMutation
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
                expect(res.body.data.happeningCreate).toBeInstanceOf(Object)
                expect(typeof res.body.data.happeningCreate.id).toBe('string')
                expect(res.body.data.happeningCreate.id.length).toBe(24)
                expect(res.body.data.happeningCreate.title).toBe('New happening')
                expect(res.body.data.happeningCreate.emoji).toBe('🫖')
                expect(res.body.data.happeningCreate.description).toBe('This is a new happening created on API')
                expect(res.body.data.happeningCreate.host).toBeInstanceOf(Object)
                expect(res.body.data.happeningCreate.host.id).toBe('000000000000000000000001')
                expect(res.body.data.happeningCreate.participants).toBeInstanceOf(Array)
                expect(res.body.data.happeningCreate.participants[0].id).toBe('000000000000000000000001')
                expect(res.body.data.happeningCreate.participants[1].id).toBe('000000000000000000000002')
                expect(res.body.data.happeningCreate.location).toBeInstanceOf(Object)
                expect(res.body.data.happeningCreate.location.type).toBe('Feature')
                expect(res.body.data.happeningCreate.location.geometry).toBeInstanceOf(Object)
                expect(res.body.data.happeningCreate.location.geometry.type).toBe('Point')
                expect(res.body.data.happeningCreate.location.geometry.coordinates).toBeInstanceOf(Array)
                expect(res.body.data.happeningCreate.location.geometry.coordinates).toEqual([112, 112.2])
                expect(res.body.data.happeningCreate.location.properties).toBeInstanceOf(Object)
                expect(res.body.data.happeningCreate.location.properties.name).toBe('Test location')
                expect(() => new Date(res.body.data.happeningCreate.created)).not.toThrow()
                return done()
            })
    })
})
describe('happeningUpdate', () => {
    it('updates happening', async (done) => {
        request
            .post("/graphql")
            .send({
                query: updateHappeningMutation
            })
            .set("Accept", "application/json")
            .set('credentials', 'include')
            .set('Authorization', `Bearer ${token}`)
            .expect("Content-Type", /json/)
            .expect(200)
            .end((err: any, res: any) => {
                if(err){
                    console.log(res.error)
                    return done(err)
                }
                
                expect(res.body).toBeInstanceOf(Object)
                expect(res.body.data.happeningUpdate).toBeInstanceOf(Object)
                expect(res.body.data.happeningUpdate.id).toBe('700000000000000000000002')
                expect(res.body.data.happeningUpdate.title).toBe('Updated title')
                expect(res.body.data.happeningUpdate.description).toBe('This is a updated happening')
                expect(res.body.data.happeningUpdate.host).toBeInstanceOf(Object)
                expect(res.body.data.happeningUpdate.host.id).toBe('000000000000000000000002')
                expect(res.body.data.happeningUpdate.participants).toBeInstanceOf(Array)
                expect(res.body.data.happeningUpdate.participants[0]).toBeInstanceOf(Object)
                expect(res.body.data.happeningUpdate.participants[0].id).toBe('000000000000000000000002')
                return done()
            })
    })

    it('updates location object without overwriting data', async (done) => {
        request
            .post("/graphql")
            .send({
                query: updateLocationMutation
            })
            .set("Accept", "application/json")
            .set('credentials', 'include')
            .set('Authorization', `Bearer ${token}`)
            .expect("Content-Type", /json/)
            .expect(200)
            .end((err: any, res: any) => {
                if(err){
                    console.log(res.error)
                    return done(err)
                }
                
                expect(res.body).toBeInstanceOf(Object)
                expect(res.body.data.happeningUpdate).toBeInstanceOf(Object)
                expect(res.body.data.happeningUpdate.id).toBe('700000000000000000000001')
                expect(res.body.data.happeningUpdate.description).toBe('This is a Very Fun Happening Description')
                expect(res.body.data.happeningUpdate.location).toBeInstanceOf(Object)
                expect(res.body.data.happeningUpdate.location.type).toBe('Feature')
                expect(res.body.data.happeningUpdate.location.geometry).toBeInstanceOf(Object)
                expect(res.body.data.happeningUpdate.location.geometry.type).toBe('Point')
                expect(res.body.data.happeningUpdate.location.geometry.coordinates).toBeInstanceOf(Array)
                expect(res.body.data.happeningUpdate.location.geometry.coordinates).toEqual([125.6, 10.1])
                expect(res.body.data.happeningUpdate.location.properties).toBeInstanceOf(Object)
                expect(res.body.data.happeningUpdate.location.properties.name).toBe('New name of location')
                return done()
            })
    })
})
describe('happeningDelete', () => {
    it('deletes happening', async (done) => {
        /* create happening to be deleted */
        request
            .post("/graphql")
            .send({
                query: createHappeningMutation
            })
            .set("Accept", "application/json")
            .set('credentials', 'include')
            .set('Authorization', `Bearer ${token}`)
            .expect("Content-Type", /json/)
            .expect(200)
            .then(({ body: { data: { happeningCreate } } }) => request
                .post("/graphql")  /* delete happening */
                .send({
                    query: `
                        mutation {
                            happeningDelete(id: "${happeningCreate.id}")
                        }
                    `
                })
                .set("Accept", "application/json")
                .set('credentials', 'include')
                .set('Authorization', `Bearer ${token}`)
                .expect(200)
                .then(res => {                    
                    expect(res.body).toBeInstanceOf(Object);
                    expect(typeof res.body.data.happeningDelete).toBe('boolean');
                    expect(res.body.data.happeningDelete).toBe(true)
                    request /* query deleted happening */
                        .post("/graphql")
                        .send({
                            query: '{ happenings { id } }'
                        })
                        .set("Accept", "application/json")
                        .set('credentials', 'include')
                        .set('Authorization', `Bearer ${token}`)
                        .expect("Content-Type", /json/)
                        .expect(200)
                        .then(res => {
                            expect(res.body.data.happenings.filter(({id}) => id === happeningCreate.id).length).toBe(0)
                            return done()
                        })
                })
            )
            .catch(done)
    })
})