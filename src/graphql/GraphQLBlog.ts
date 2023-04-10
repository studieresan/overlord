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

const MutableBlogFields = {
  title: { type: GraphQLString },
  description: { type: GraphQLString },
  date: { type: GraphQLDateTime },
  pictures: { type: new GraphQLList(GraphQLString) },
  frontPicture: { type: GraphQLString },
  published: { type: GraphQLBoolean },
}

export const BlogType: GraphQLObjectType = new GraphQLObjectType({
  name: 'Blog',
  fields: () => ({
    author: { type: GraphQLString },
    id: { type: GraphQLID },
    studsYear: { type: new GraphQLNonNull(GraphQLInt) },
    ...MutableBlogFields,
  }),
})

export const BlogInputType = new GraphQLInputObjectType({
  name: 'BlogInput',
  fields: () => ({
    author: { type: GraphQLString },
    id: { type: GraphQLID },
    studsYear: { type: GraphQLInt },
    ...MutableBlogFields,
  }),
})