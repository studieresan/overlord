import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLNonNull,
} from 'graphql'
import { GraphQLDateTime } from './GraphQLDateTime'
import { Company } from './GraphQLCompany'
import { UserType } from './GraphQLUser'

const MutableEventFields = {
  schedule: { type: GraphQLString },
  location: { type: GraphQLString },
  privateDescription: { type: GraphQLString },
  publicDescription: { type: GraphQLString },
  date: { type: GraphQLDateTime },
  beforeSurveys: { type: new GraphQLList(GraphQLString) },
  afterSurveys: { type: new GraphQLList(GraphQLString) },
  pictures: { type: new GraphQLList(GraphQLString) },
  published: { type: new GraphQLNonNull(GraphQLBoolean) },
}

export const EventType = new GraphQLObjectType({
  name : 'Event',
  fields : {
    id: { type: GraphQLString },
    company: { type: Company },
    companyName: { type: GraphQLString },
    responsible: { type: UserType },
    ...MutableEventFields,
  },
})

export const EventInputType = new GraphQLInputObjectType({
  name : 'EventInput',
  fields : {
    responsibleUserId: {type: GraphQLString},
    ...MutableEventFields,
  },
})
