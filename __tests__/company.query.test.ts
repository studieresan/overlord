const supertest = require("supertest")
import { app } from '../src/server'
import { mockDatabase, closeDatabase } from './utillity/mockDatabase'
import { getCompanyByIdQuery } from './utillity/companyQueries'

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

describe('company', () => {
    it('returns the company with the specified companyId', async (done) => {
        request
            .post("/graphql")
            .send({
                query: getCompanyByIdQuery
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
                };
                expect(res.body).toBeInstanceOf(Object)
                expect(res.body.data.company).toBeInstanceOf(Object)
                expect(res.body.data.company.id).toBe('100000000000000000000001')
                expect(res.body.data.company.name).toBe('Test Company')
                // CompanyContact
                expect(res.body.data.company.companyContacts).toBeInstanceOf(Array)
                expect(res.body.data.company.companyContacts.length).toBe(1)
                expect(res.body.data.company.companyContacts[0]).toBeInstanceOf(Object)
                expect(res.body.data.company.companyContacts[0].id).toBe('300000000000000000000001')
                expect(res.body.data.company.companyContacts[0].name).toBe('Company Contact')
                expect(res.body.data.company.companyContacts[0].email).toBe('companyContact@TestCompany.com')
                expect(res.body.data.company.companyContacts[0].phone).toBe('070-112 11 22')
                expect(res.body.data.company.companyContacts[0].comment).toBe('CompanyContact is the contact of Test Company')
                // CompanyStudsYear
                expect(res.body.data.company.statuses).toBeInstanceOf(Array)
                expect(res.body.data.company.statuses.length).toBe(1)
                expect(res.body.data.company.statuses[0]).toBeInstanceOf(Object)
                expect(res.body.data.company.statuses[0]).toBe(1)
                expect(res.body.data.company.statuses[0].studsYear).toBe('TODO')
                expect(res.body.data.company.statuses[0].statusDescription).toBe('TODO')
                expect(res.body.data.company.statuses[0].statusPriority).toBe('TODO')
                expect(res.body.data.company.statuses[0].amount).toBe('TODO')
                // SalesComments
                expect(res.body.data.company.statuses[0].salesComments).toBeInstanceOf(Array)
                expect(res.body.data.company.statuses[0].salesComments.length).toBeInstanceOf(1)
                expect(res.body.data.company.statuses[0].salesComments[0].id).toBe(1)
                expect(res.body.data.company.statuses[0].salesComments[0].text).toBe(1)
                expect(res.body.data.company.statuses[0].salesComments[0].createdAt).toBe(1)
                expect(res.body.data.company.statuses[0].salesComments[0].user).toBeInstanceOf(Object)
                expect(res.body.data.company.statuses[0].salesComments[0].user.id).toBe('TODO')
                expect(res.body.data.company.statuses[0].responsibleUser).toBeInstanceOf(Object)
                expect(res.body.data.company.statuses[0].responsibleUser.id).toBe('TODO')
                expect(res.body.data.company.statuses[0].responsibleUser.firstName).toBe('TODO')
                expect(res.body.data.company.statuses[0].responsibleUser.lastName).toBe('TODO')
                return done()
            })
    })

    it('responds with 401 - Unauthorized when correct is not sent', async (done) => {
        request
            .post("/graphql")
            .send({
                query: '{ company(companyId: "100000000000000000000001") {id} }'
            })
            .set("Accept", "application/json")
            .expect(401)
            .end(done)
    })
})

describe('companies', () => {
    it.todo('returns a list of all companies in the database')
    it.todo('returns only companies with the specified companyId')
    it.todo('responds with 400 on a bad request')
})