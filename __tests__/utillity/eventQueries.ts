export const getEventByIDQuery = `{
    event(eventId: "200000000000000000000001") {
        id
        date
        location
        publicDescription
        privateDescription
        beforeSurvey
        afterSurvey
        pictures
        published
        responsible {
            id,
            firstName,
            lastName,
        }
        company { 
            id, 
            name 
        }
        studsYear
    }
}`

export const validPublicQuery = `
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

export const invalidPublicQuery = `
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

export const publicQuery2021 = `
{
    events(studsYear: 2021) {
        id
        studsYear
    }
}`

export const badEventQuery = `
{
    event(eventId: "200000000000000000000001") {
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

export const badEventsQuery = `
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


export const eventCreateValid = `
mutation {
    eventCreate(fields: {
        responsibleUserID: "000000000000000000000002"
        companyID: "100000000000000000000001"
        studsYear: 2001
        date: "2001-02-03"
        location: "On The New Location"
        publicDescription: "This is a new event description created by me"
        privateDescription: "This is a new private event description created by me"
        beforeSurvey: "linkto/newBeforeSurvey"
        afterSurvey: "linkto/newAfterSurvey"
        pictures: ["linkto/picture-5"]
        published: false
    }) {
        id
        date
        location
        publicDescription
        privateDescription
        beforeSurvey
        afterSurvey
        pictures
        published
        responsible {
            id,
            firstName,
            lastName,
        }
        company { 
            id, 
            name 
        }
        studsYear
    }
}`

export const eventDeleteValid = `
mutation {
    eventDelete(id: "200000000000000000000001") {
        location
    }
}`