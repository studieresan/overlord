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
    id: { type: GraphQLID },
    ...MutableEventFields,
    author: { type: GraphQLString },
    studsYear: { type: new GraphQLNonNull(GraphQLInt) },
  }),
})

export const EventCreateType = new GraphQLObjectType({
  name: 'EventCreateType',
  fields: () => ({
    author: { type: GraphQLString },
    id: { type: GraphQLID },
    studsYear: { type: new GraphQLNonNull(GraphQLInt) },
    ...MutableEventFields,
  }),
})

export const EventInputType = new GraphQLInputObjectType({
  name: 'EventInput',
  fields: () => ({
    author: { type: GraphQLString },
    id: { type: GraphQLID },
    studsYear: { type: GraphQLInt },
    ...MutableEventFields,
  }),
})
