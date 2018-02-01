import {
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'

export const EventCheckInType = new GraphQLObjectType({
  name : 'EventCheckIn',
  fields : {
    userId: { type: GraphQLString },
    checkedInAt: { type: GraphQLString },
    checkedInById: { type: GraphQLString },
  },
})
