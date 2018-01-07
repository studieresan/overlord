import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLInputObjectType,
  GraphQLString,
} from 'graphql'

const MutableEventFields = {
  companyName: { type: GraphQLString },
  schedule: { type: GraphQLString },
  location: { type: GraphQLString },
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
    ...MutableEventFields,
  },
})

export const EventInputType = new GraphQLInputObjectType({
  name : 'EventInput',
  fields : MutableEventFields,
})
