const supertest = require("supertest")
import {app} from '../src/server'
import { mockDatabase, closeDatabase } from './utillity/mockDatabase'

let server: any
let request: any
let token: any

beforeAll(async () => {
    await mockDatabase();
    server = app.listen(2023);
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


const validPublicQuery = `
{
    events {
        id
        date
        studsYear
        publicDescription
        pictures
        company { 
            id, 
            name 
        }
    }
}`

const invalidPublicQuery = `
{
    events {
        id
        location
        privateDescription
        beforeSurvey
        afterSurvey
        pictures
        published
        responsible { 
            id
            name
        }
    }
}`

const publicQuery2021 = `
{
    events(studsYear: 2021) {
        id
        date
        studsYear
        publicDescription
        pictures
        company { 
            id, 
            name 
        }
    }
}`

const singleEventByIDQuery = `{
    event(eventId: "200000000000000000000001") {
        id
        date
        studsYear
        publicDescription
        pictures
        company { 
            id, 
            name 
        }
    }
}`

const badQuery1 = `
{
    events {
        id
        thisIsNotAThing
        location
        privateDescription
        beforeSurvey
        afterSurvey
        pictures
        published
        responsible { 
            id
            name
        }
    }
}`



describe('event query', () => {
    it('returns list of public events', async (done) => {
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
    it('returns only events with specified studsYear', async (done) => {
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
                return done();
            })
    })

    it('returns the event with eventID', async (done) => {
        request
            .post("/graphql")
            .send({
                query: singleEventByIDQuery
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
                expect(res.body.data.event).toBeInstanceOf(Object);
                expect(res.body.data.event.id).toBe('200000000000000000000001')
                return done();
            })
    })

    it('responds with 400 on bad request', async (done) => {
        request
            .post("/graphql")
            .send({
                query: badQuery1
            })
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(400)
            .end(done)
    })
})