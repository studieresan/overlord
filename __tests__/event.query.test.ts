const supertest = require("supertest")
import { app } from '../src/server'
import { mockDatabase, closeDatabase } from './utillity/mockDatabase'
import {
    getEventByIdQuery,
    badEventQuery,
    validPublicQuery,
    publicQuery2021,
    badEventsQuery,
} from './utillity/eventQueries'

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

describe('event', () => {
    it('returns the event with the specified eventId', async (done) => {
        request
            .post("/graphql")
            .send({
                query: getEventByIdQuery
            })
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200)
            .end((err: any, res: any) => {
                if (err) {
                    console.error(res.body)
                    return done(err)
                };
                expect(res.body).toBeInstanceOf(Object)
                expect(res.body.data.event).toBeInstanceOf(Object)
                expect(res.body.data.event.id).toBe('200000000000000000000001')
                expect(res.body.data.event.date).toBe('2020-12-24T00:00:00.000Z')
                expect(res.body.data.event.location).toBe('location')
                expect(res.body.data.event.publicDescription).toBe('publicDescription')
                expect(res.body.data.event.privateDescription).toBe('privateDescription')
                expect(res.body.data.event.beforeSurvey).toBe('linkto/beforeSurvey')
                expect(res.body.data.event.afterSurvey).toBe('linkto/afterSurvey')
                expect(res.body.data.event.pictures).toBeInstanceOf(Array)
                expect(res.body.data.event.pictures[0]).toBe('linkto/picture-1')
                expect(res.body.data.event.pictures[1]).toBe('linkto/picture-2')
                expect(typeof res.body.data.event.published).toBe('boolean')
                expect(res.body.data.event.published).toBe(true)
                expect(res.body.data.event.responsible).toBeInstanceOf(Object)
                expect(res.body.data.event.responsible.id).toBe('000000000000000000000001')
                expect(res.body.data.event.responsible.firstName).toBe('Test')
                expect(res.body.data.event.responsible.lastName).toBe('Testsson')
                expect(res.body.data.event.company).toBeInstanceOf(Object)
                expect(res.body.data.event.company.id).toBe('100000000000000000000001')
                expect(res.body.data.event.company.name).toBe('Test Company')
                expect(res.body.data.event.studsYear).toBe(2020)
                return done()
            })
    })

    it('responds with 400 on a bad request', async (done) => {
        request
            .post("/graphql")
            .send({
                query: badEventQuery
            })
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(400)
            .end(done)
    })

    it('responds with 400 on eventId not in database', async (done) => {
        request
            .post("/graphql")
            .send({
                query: '{event(eventId: "220000000000000000000001"){id}}'
            })
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200)
            .end((err, res) => {
                if(err) return done(err)
                expect(res.body.errors.length).toBe(1)
                return done()
            })
    })
})

describe('events', () => {
    it('returns a list of all public events in database', async (done) => {
        request
            .post("/graphql")
            .send({
                query: validPublicQuery
            })
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200)
            .end((err: any, res: any) => {
                if (err) {
                    console.error(res.body)
                    return done(err)
                };
                expect(res.body).toBeInstanceOf(Object)
                expect(res.body.data.events).toBeInstanceOf(Array)
                expect(res.body.data.events.length).toBe(2)

                /* company 1 */
                expect(res.body.data.events[0]).toBeInstanceOf(Object)
                expect(res.body.data.events[0].id).toBe('200000000000000000000002')
                expect(res.body.data.events[0].date).toBe('2021-01-12T00:00:00.000Z')
                expect(res.body.data.events[0].studsYear).toBe(2021)
                expect(res.body.data.events[0].publicDescription).toBe('publicDescription2')
                expect(res.body.data.events[0].pictures).toBeInstanceOf(Array)
                expect(res.body.data.events[0].pictures[0]).toBe('linkto/picture-3')
                expect(res.body.data.events[0].pictures[1]).toBe('linkto/picture-4')
                expect(res.body.data.events[0].company).toBeInstanceOf(Object)
                expect(res.body.data.events[0].company.id).toBe('100000000000000000000001')
                expect(res.body.data.events[0].company.name).toBe('Test Company')

                /* company 2 */
                expect(res.body.data.events[1]).toBeInstanceOf(Object)
                expect(res.body.data.events[1].id).toBe('200000000000000000000001')
                expect(res.body.data.events[1].date).toBe('2020-12-24T00:00:00.000Z')
                expect(res.body.data.events[1].studsYear).toBe(2020)
                expect(res.body.data.events[1].publicDescription).toBe('publicDescription')
                expect(res.body.data.events[1].pictures).toBeInstanceOf(Array)
                expect(res.body.data.events[1].pictures[0]).toBe('linkto/picture-1')
                expect(res.body.data.events[1].pictures[1]).toBe('linkto/picture-2')
                expect(res.body.data.events[1].company).toBeInstanceOf(Object)
                expect(res.body.data.events[1].company.id).toBe('100000000000000000000001')
                expect(res.body.data.events[1].company.name).toBe('Test Company')
                
                return done();
            })
    })
    it('returns only events with the specified studsYear', async (done) => {
        request
            .post("/graphql")
            .send({
                query: publicQuery2021
            })
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200)
            .end((err: any, res: any) => {
                if (err) {
                    console.error(res.body)
                    return done(err)
                };
                expect(res.body).toBeInstanceOf(Object);
                expect(res.body.data.events).toBeInstanceOf(Array);
                expect(res.body.data.events.length).toBe(1)
                expect(res.body.data.events[0].id).toBe('200000000000000000000002')
                expect(res.body.data.events[0].studsYear).toBe(2021)
                return done();
            })
    })

    it('responds with 400 on a bad request', async (done) => {
        request
            .post("/graphql")
            .send({
                query: badEventsQuery
            })
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(400)
            .end(done)
    })
})