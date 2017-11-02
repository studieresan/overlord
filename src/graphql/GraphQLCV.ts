import {
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'

const MutableItemFields = {
  title: { type: GraphQLString },
  description: { type: GraphQLString },
  start: { type: GraphQLInt },
  end: { type: GraphQLInt },
}

export const GraphQLCVItem = new GraphQLObjectType({
  name: 'CVItem',
  fields: {
    ...MutableItemFields,
  },
})

export const GraphQLCVItemInput = new GraphQLInputObjectType ({
  name: 'CVItemInput',
  fields: {
    ...MutableItemFields,
  },
})

const MutableCVSectionFields = {
  title: { type: GraphQLString },
  description: { type: GraphQLString },
  items: { type: new GraphQLList(GraphQLCVItem) },
}

export const GraphQLCVSection = new GraphQLObjectType({
  name: 'CVSection',
  fields: {
    ...MutableCVSectionFields,
  },
})

export const GraphQLCVSectionInput = new GraphQLInputObjectType({
  name: 'CVSectionInput',
  fields: {
    ...MutableCVSectionFields,
  },
})

const MutableCVFields = {
  text: { type: GraphQLString },
  sections: { type: new GraphQLList(GraphQLCVSection) },
}

export const GraphQLCV = new GraphQLObjectType({
  name: 'CV',
  fields: {
    userId: { type: GraphQLString },
    ...MutableCVFields,
  },
})

export const GraphQLCVInput = new GraphQLInputObjectType({
  name: 'CVInput',
  fields:  {
    ...MutableCVFields,
  },
})
