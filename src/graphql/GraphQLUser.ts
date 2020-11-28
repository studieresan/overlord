import {
    UserInfoType,
} from './GraphQLUserInfo'
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLID,
} from 'graphql'
import { CVType } from './GraphQLCV'


export const UserType = new GraphQLObjectType({
  name : 'User',
  fields : {
    id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    studsYear: { type: GraphQLInt },
    info: { type: UserInfoType },
    cv: { type: CVType },
  },
})
