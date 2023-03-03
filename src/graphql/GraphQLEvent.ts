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
import { UserType } from './GraphQLUser'

const MutableEventFields = {
  title: { type: GraphQLString },
  description: { type: GraphQLString },
  date: { type: GraphQLDateTime },
  pictures: { type: new GraphQLList(GraphQLString) },
  frontPicture: { type: GraphQLString },
  published: { type: GraphQLBoolean },
}

export const EventType: GraphQLObjectType = new GraphQLObjectType({
  name: 'Event',
  fields: () => ({
    author: { type: UserType },
    id: { type: GraphQLID },
    studsYear: { type: GraphQLInt },
    ...MutableEventFields,
  }),
})

export const EventInputType = new GraphQLInputObjectType({
  name: 'EventInput',
  fields: () => ({
    author_id: { type: GraphQLString },
    id: { type: GraphQLID },
    studsYear: { type: GraphQLInt },
    ...MutableEventFields,
  }),
})
