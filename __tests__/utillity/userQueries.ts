export const getUserQuery = `{
    user {
        id
        firstName
        lastName
        studsYear
        info {
            role
            email
            phone
            linkedIn
            github
            master
            allergies
            picture
            permissions
        }
    }
}`

export const getUsersQuery = `{
    users {
        id
        firstName
        lastName
        studsYear
        info {
            role
            email
            phone
            linkedIn
            github
            master
            allergies
            picture
            permissions
        }
    }
}`