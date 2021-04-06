export const createHappeningMutation = `
mutation { 
    happeningCreate(fields: {
        title: "New happening"
        emoji: "🫖"
        description: "This is a new happening created on API"
        host: "000000000000000000000001"
        participants: ["000000000000000000000001", "000000000000000000000002"]
        location: {
            type: "Feature"
            geometry: {
                type: "Point"
                coordinates: [112, 112.2]
            }
            properties: {
                name: "Test location"
            }
        }
    }) {
        id
        title
        emoji
        description
        host {
            id
        } 
        participants {
            id
        }
        location {
            type
            geometry {
                type
                coordinates
            }
            properties {
                name
            }
        }
        created
    }
}`

export const updateHappeningMutation = `
mutation { 
    happeningUpdate(id: "700000000000000000000002", fields: {
        title: "Updated title"
        description: "This is a updated happening"
        host: "000000000000000000000002"
        participants: ["000000000000000000000002"]
    }) {
        id
        title
        description
        host {
            id
        } 
        participants {
            id
        }
    }
}`

export const updateLocationMutation = `
mutation { 
    happeningUpdate(id: "700000000000000000000001", fields: {
        location: {
            properties: {
                name: "New name of location"
            }
        }
    }) {
        id
        description
        location {
            type
            geometry {
                type
                coordinates
            }
            properties {
                name
            }
        }
    }
}`
