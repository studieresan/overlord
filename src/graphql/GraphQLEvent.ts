import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLInputObjectType,
  GraphQLEnumType,
  GraphQLString,
} from 'graphql'
import * as models from './../models'

const MutableEventFields = {
  schedule: { type: GraphQLString },
  privateDescription: { type: GraphQLString },
  publicDescription: { type: GraphQLString },
  date: { type: GraphQLString },
  beforeSurveys: { type: new GraphQLList(GraphQLString) },
  afterSurveys: { type: new GraphQLList(GraphQLString) },
  pictures: { type: new GraphQLList(GraphQLString) },
}

export const EventType = new GraphQLObjectType({
  name : 'Event',
  fields : {
    id: { type: GraphQLString },
    companyName: { type: GraphQLString },
    ...MutableEventFields,
  },
})

export const EventInputType = new GraphQLInputObjectType({
  name : 'UserProfileInput',
  fields : MutableEventFields,
})
