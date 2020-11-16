import {
  UserProfileType,
} from './GraphQLUserProfile'
import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLInt,
  GraphQLID,
} from 'graphql'


export const UserType = new GraphQLObjectType({
  name : 'User',
  fields : {
    id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    year: { type: GraphQLInt },
    profile: { type: UserProfileType },
    permissions: { type: new GraphQLList(GraphQLString) },
  },
})

