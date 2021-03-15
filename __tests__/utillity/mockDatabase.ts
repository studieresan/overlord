import { MongoMemoryServer } from 'mongodb-memory-server'
let mongoServer: MongoMemoryServer
import * as mongoose from 'mongoose'
import { ObjectID } from 'mongodb'

import { User } from '../../src/mongodb/User'                               //ObjectIDs 0...
import { Company } from '../../src/mongodb/Company'                         //ObjectIDs 1...
import { Event } from '../../src/mongodb/Event'                             //ObjectIDs 2...
import { CompanyContact } from '../../src/mongodb/CompanyContact'           //ObjectIDs 3...
import { CompanySalesStatus } from '../../src/mongodb/CompanySalesStatus'   //ObjectIDs 4...
import { SalesComment } from '../../src/mongodb/SalesComment'               //ObjectIDs 5...
import { CV } from '../../src/mongodb/CV'                                   //ObejctIDs 6...
import { Happening } from '../../src/mongodb/Happening'                     //ObejctIDs 7...

const addUsers = async () => {
    await new User({
        _id: new ObjectID('000000000000000000000001'),
        firstName: 'Test',
        lastName: 'Testsson',
        userRole: 'it_group',
        studsYear: 2021,
        info: {
            password: 'password',
            role: 'it_group',
            email: 'test@test.se',
            phone: '012-345 67 89',
            linkedIn: 'https://www.linkedin.com/in/test-testsson/',
            github: 'https://github.com/testtestsson',
            master: 'AI',
            allergies: 'bugs',
            picture: 'linkto/imageTestsson',
            permissions: ['admin_permission', 'events_permission'],
        },
    }).save()

    await new User({
        _id: new ObjectID('000000000000000000000002'),
        firstName: 'John',
        lastName: 'Doe',
        userRole: 'travel_group',
        info: {
            email: 'johndoe@test.se',
            password: 'password123',
        },
        
    }).save()
}

const addCompanySalesStatuses = async () => {
    await new CompanySalesStatus({
        _id: new ObjectID('400000000000000000000001'),
        name: 'Allt klart',
        priority: '9',
    }).save()
}

const addCompanies = async () => {
    await new Company({
        _id: new ObjectID('100000000000000000000001'),
        name: 'Test Company'
    }).save().then(company => company
        .populate('years.status')
        .populate('years.responsibleUser')
        .execPopulate()
    )
}

const addCompanyContacts = async () => {
    await new CompanyContact({
        _id: '300000000000000000000001',
        name: 'Company Contact',
        phoneNumber: '070-112 11 22',
        email: 'companyContact@TestCompany.com',
        comment: 'CompanyContact is the contact of Test Company',
        company: new ObjectID('100000000000000000000001'),
    }).save()
}

const addSalesComments = async () => {
    await new SalesComment({
        _id: new ObjectID('500000000000000000000001'),
        text: 'En konstig kommentar',
        user: new ObjectID('000000000000000000000001'),
        company: new ObjectID('100000000000000000000001')
    }).save()
}

const addEvents = async () => {
    await new Event({
        _id: new ObjectID('200000000000000000000001'),
        company: new ObjectID('100000000000000000000001'),
        responsible: new ObjectID('000000000000000000000001'),
        location: 'location',
        privateDescription: 'privateDescription',
        publicDescription: 'publicDescription',
        date: new Date('2020-12-24'),
        studsYear: 2020,
        published: true,
        pictures: ['linkto/picture-1', 'linkto/picture-2'],
        beforeSurvey: 'linkto/beforeSurvey',
        afterSurvey: 'linkto/afterSurvey',
    }).save().then(event => event
        .populate('company')
        .populate('responsible')
        .execPopulate()
    )

    await new Event({
        _id: new ObjectID('200000000000000000000002'),
        company: new ObjectID('100000000000000000000001'),
        responsible: new ObjectID('000000000000000000000002'),
        location: 'newLocation',
        privateDescription: 'privateDescription2',
        publicDescription: 'publicDescription2',
        date: new Date('2021-01-12'),
        studsYear: 2021,
        published: false,
        pictures: ['linkto/picture-3', 'linkto/picture-4'],
        beforeSurvey: 'linkto/beforeSurvey2',
        afterSurvey: 'linkto/afterSurvey2',
    }).save().then(event => event
        .populate('company')
        .populate('responsible')
        .execPopulate()
    )
}

const addCVs = async () => {
    //TODO
}

const addHappenings = async () => {
    await new Happening({
        _id: new ObjectID('700000000000000000000001'),
        title: 'A Very Fun Happening',
        emoji: '🍺🍽',
        description: 'This is a Very Fun Happening Description',
        host: new ObjectID('000000000000000000000001'),
        participants: [new ObjectID('000000000000000000000001'), new ObjectID('000000000000000000000002')],
        location: {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [125.6, 10.1],
            },
            properties: {
                name: "Dinagat Islands"
            },
        },
    }).save()

    await new Happening({
        _id: new ObjectID('700000000000000000000002'),
        title: 'A New Very Fun Happening',
    }).save()
}

const mockDatabase = async () => {
    mongoServer = new MongoMemoryServer()
    const options = {
        promiseLibrary: global.Promise,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
    }
    let uri = await mongoServer.getUri()
    await mongoose.disconnect(() => mongoose.connect(uri, options, (err) => {
        if(err) console.log(err)
    }))
    
    await addUsers()
    await addCompanySalesStatuses()
    await addCompanies()
    await addCompanyContacts()
    await addSalesComments()
    await addEvents()
    await addCVs()
    await addHappenings()
}

const closeDatabase = async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
}
export {
    mockDatabase, 
    closeDatabase
}