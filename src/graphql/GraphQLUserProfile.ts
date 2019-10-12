import {
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLEnumType,
  GraphQLString,
} from 'graphql'
import * as models from './../models'

const MutableProfileFields = {
  firstName: { type: GraphQLString },
  lastName: { type: GraphQLString },
  position: { type: GraphQLString },
  linkedIn: { type: GraphQLString },
  github: { type: GraphQLString },
  phone: { type: GraphQLString },
  allergies: { type: GraphQLString },
  master: { type: GraphQLString },
}

export const UserRole = new GraphQLEnumType({
  name : 'UserRole',
  values: {
    'project_manager': { value: models.UserRole.ProjectManager },
    'it_group': { value: models.UserRole.ItGroup },
    'sales_group': { value: models.UserRole.SalesGroup },
    'finance_group': { value: models.UserRole.FinanceGroup },
    'event_group': { value: models.UserRole.EventGroup },
    'travel_group': { value: models.UserRole.TravelGroup },
    'info_group': { value: models.UserRole.InfoGroup },
  },
})

export const UserProfileType = new GraphQLObjectType({
  name : 'UserProfile',
  fields : {
    email:  { type: GraphQLString },
    userRole:  { type: UserRole },
    picture:  { type: GraphQLString },
    companyName: { type: GraphQLString },
    ...MutableProfileFields,
  },
})

// This type represents the fields that a user can change about themselves
export const UserProfileInputType = new GraphQLInputObjectType({
  name : 'UserProfileInput',
  fields : MutableProfileFields,
})
