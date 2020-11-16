import {
    UserInfoType,
} from './GraphQLUserInfo'
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
    info: { type: UserInfoType },
    permissions: { type: new GraphQLList(GraphQLString) },
  },
})

