export const getCompanyByIdQuery = `{
    company(companyId: "100000000000000000000001") {
        id
        name
        companyContacts {
            id
            name
            email
            phone
            comment
        }
        statuses {
            studsYear
            statusDescription
            statusPriority
            amount
            salesComments {
                id
                text
                createdAt
                user {
                    id
                    firstName
                    lastName
                }
            }
            responsibleUser{
                id
                firstName
                lastName
            }
        }
    }
}`