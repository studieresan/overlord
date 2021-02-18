import { MongoMemoryServer } from 'mongodb-memory-server'
let mongoServer: MongoMemoryServer
import * as mongoose from 'mongoose'
import { ObjectID } from 'mongodb'

import { User } from '../../src/mongodb/User'
import { Company } from '../../src/mongodb/Company'
import { Event } from '../../src/mongodb/Event'

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
    await new User({
        _id: new ObjectID('000000000000000000000001'),
        firstName: 'Test',
        lastName: 'Testsson',
        userRole: 'it_group',
        info: {
            email: 'test@test.se',
            password: 'password',
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
    

    await new Company({
        _id: new ObjectID('100000000000000000000001'),
        name: 'Test Company'
    }).save().then(company => company
        .populate('years.status')
        .populate('years.responsibleUser')
        .execPopulate()
    )

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

    return
}

const closeDatabase = async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
}
export {
    mockDatabase, 
    closeDatabase
}