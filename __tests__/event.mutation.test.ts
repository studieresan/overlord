const supertest = require("supertest")
import { app } from '../src/server'
import { mockDatabase, closeDatabase } from './utillity/mockDatabase'
import { eventCreateValid } from './utillity/eventQueries'

let server: any
let request: any
let token: any

beforeAll(async () => {
    await mockDatabase();
    server = app.listen(2026);
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

describe('eventCreate', () => {
    it('creates event', async (done) => {
        request
            .post("/graphql")
            .send({
                query: eventCreateValid
            })
            .set("Accept", "application/json")
            .set('credentials', 'include')
            .set('Authorization', `Bearer ${token}`)
            .expect("Content-Type", /json/)
            .expect(200)
            .end((err, res) => {
                if(err) return done(err)

                expect(res.body).toBeInstanceOf(Object);
                expect(res.body.data.eventCreate).toBeInstanceOf(Object);
                expect(res.body.data.eventCreate.location).toBe('On The New Location')
                expect(res.body.data.eventCreate.date).toBe('2001-02-03T00:00:00.000Z')
                expect(res.body.data.eventCreate.studsYear).toBe(2001)
                expect(res.body.data.eventCreate.publicDescription).toBe('This is a new event description created by me')
                expect(res.body.data.eventCreate.privateDescription).toBe('This is a new private event description created by me')
                expect(res.body.data.eventCreate.pictures).toBeInstanceOf(Array)
                expect(res.body.data.eventCreate.pictures[0]).toBe('linkto/picture-5')
                expect(res.body.data.eventCreate.beforeSurvey).toBe('linkto/newBeforeSurvey')
                expect(res.body.data.eventCreate.afterSurvey).toBe('linkto/newAfterSurvey')
                expect(res.body.data.eventCreate.published).toBe(false)
                expect(res.body.data.eventCreate.responsible).toBeInstanceOf(Object)
                expect(res.body.data.eventCreate.responsible.id).toBe('000000000000000000000002')
                expect(res.body.data.eventCreate.responsible.firstName).toBe('John')
                expect(res.body.data.eventCreate.responsible.lastName).toBe('Doe')
                expect(res.body.data.eventCreate.company).toBeInstanceOf(Object)
                expect(res.body.data.eventCreate.company.id).toBe('100000000000000000000001')
                expect(res.body.data.eventCreate.company.name).toBe('Test Company')
                return done()
            })
    })
})

describe('eventUpdate', () => {
    it('updates event', async (done) => {
        request
            .post("/graphql")
            .send({
                query: eventCreateValid
            })
            .set("Accept", "application/json")
            .set('credentials', 'include')
            .set('Authorization', `Bearer ${token}`)
            .expect("Content-Type", /json/)
            .expect(200)
            .then(({ body: { data: { eventCreate } } }) => request
                .post("/graphql")
                .send({
                    query: `
                        mutation {
                            eventUpdate(id: "${eventCreate.id}", fields: {
                                location: "Same event on a new location"
                            }) {
                                id
                                location
                                publicDescription
                                responsible {
                                    id
                                }
                                company {
                                    id
                                }
                            }
                        }
                    `
                })
                .set("Accept", "application/json")
                .set('credentials', 'include')
                .set('Authorization', `Bearer ${token}`)
                .expect("Content-Type", /json/)
                .expect(200)
                .then(res => {    
                    expect(res.body).toBeInstanceOf(Object);
                    expect(res.body.data.eventUpdate).toBeInstanceOf(Object);
                    expect(res.body.data.eventUpdate.id).toBe(eventCreate.id)
                    expect(res.body.data.eventUpdate.location).toBe('Same event on a new location')
                    expect(res.body.data.eventUpdate.publicDescription).toBe('This is a new event description created by me')
                    expect(res.body.data.eventUpdate.responsible).toBeInstanceOf(Object)
                    expect(res.body.data.eventUpdate.responsible.id).toBe('000000000000000000000002')
                    expect(res.body.data.eventUpdate.company).toBeInstanceOf(Object)
                    expect(res.body.data.eventUpdate.company.id).toBe('100000000000000000000001')
                    return done()
                })
            )
            .catch(done)
    })
})

describe('eventDelete', () => {
    it('deletes event', async (done) => {
        /* create element to be deleted */
        request
            .post("/graphql")
            .send({
                query: eventCreateValid
            })
            .set("Accept", "application/json")
            .set('credentials', 'include')
            .set('Authorization', `Bearer ${token}`)
            .expect("Content-Type", /json/)
            .expect(200)
            .then(({ body: { data: { eventCreate } } }) => request  /* delete event */
                .post("/graphql")
                .send({
                    query: `
                        mutation {
                            eventDelete(id: "${eventCreate.id}")
                        }
                    `
                })
                .set("Accept", "application/json")
                .set('credentials', 'include')
                .set('Authorization', `Bearer ${token}`)
                .expect("Content-Type", /json/)
                .expect(200)
                .then(res => {                    
                    expect(res.body).toBeInstanceOf(Object);
                    expect(typeof res.body.data.eventDelete).toBe('boolean');
                    expect(res.body.data.eventDelete).toBe(true)
                    request /* query deleted event */
                        .post("/graphql")
                        .send({
                            query: `{event(eventId: "${eventCreate.id}"){id}}`
                        })
                        .set("Accept", "application/json")
                        .expect("Content-Type", /json/)
                        .expect(200)
                        .then(res => {
                            expect(res.body.errors.length).toBe(1)
                            return done()
                        })
                })
            )
            .catch(done)
    })
})