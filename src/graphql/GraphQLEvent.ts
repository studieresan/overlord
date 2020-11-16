import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLID,
  GraphQLBoolean,
  GraphQLNonNull,
} from 'graphql'
import { GraphQLDateTime } from './GraphQLDateTime'
import { Company } from './GraphQLCompany'
import { UserType } from './GraphQLUser'
import { StatusType } from './GraphQLEventStatus'

const MutableEventFields = {
  date: { type: GraphQLDateTime },
  studsYear: { type: GraphQLInt },
  location: { type: GraphQLString },
  publicDescription: { type: GraphQLString },
  privateDescription: { type: GraphQLString },
  beforeSurvey: { type: GraphQLString },
  afterSurvey: { type: GraphQLString },
  pictures: { type: new GraphQLList(GraphQLString) },
  published: { type: new GraphQLNonNull(GraphQLBoolean) },
}


export const EventType: GraphQLObjectType = new GraphQLObjectType({
  name: 'Event',
  fields: () => ({
    id: { type: GraphQLID },
    ...MutableEventFields,
    responsible: { type: UserType },
    company: { type: Company },
    status: { type: StatusType },
  }),
})

export const EventInputType = new GraphQLInputObjectType({
  name: 'EventInput',
  fields: () => ({
    responsibleUserId: {type: GraphQLString},
    ...MutableEventFields,
  }),
})
