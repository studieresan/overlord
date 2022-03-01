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

const MutableBlogFields = {
  title: { type: GraphQLString },
  description: { type: GraphQLString },
  date: { type: GraphQLDateTime },
  pictures: { type: new GraphQLList(GraphQLString) },
  frontpicture: { type: GraphQLString },
  published: { type: GraphQLBoolean },
}

export const BlogType: GraphQLObjectType = new GraphQLObjectType({
  name: 'Blog',
  fields: () => ({
    author: { type: UserType },
    id: { type: GraphQLID },
    studsYear: {type: GraphQLInt},
    ...MutableBlogFields,
  }),
})

export const BlogInputType = new GraphQLInputObjectType({
  name: 'BlogInput',
  fields: () => ({
    author: { type: GraphQLID },
    id: { type: GraphQLID },
    studsYear: {type: GraphQLInt},
    ...MutableBlogFields,
  }),
})