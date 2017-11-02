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
}

export const GraphQLCVSection = new GraphQLObjectType({
  name: 'CVSection',
  fields: {
    ...MutableCVSectionFields,
    items: { type: new GraphQLList(GraphQLCVItem) },
  },
})

export const GraphQLCVSectionInput = new GraphQLInputObjectType({
  name: 'CVSectionInput',
  fields: {
    ...MutableCVSectionFields,
    items: { type: new GraphQLList(GraphQLCVItemInput) },
  },
})

export const GraphQLCV = new GraphQLObjectType({
  name: 'CV',
  fields: {
    userId: { type: GraphQLString },
    text: { type: GraphQLString },
    sections: { type: new GraphQLList(GraphQLCVSection) },
  },
})

export const GraphQLCVInput = new GraphQLInputObjectType({
  name: 'CVInput',
  fields:  {
    text: { type: GraphQLString },
    sections: { type: new GraphQLList(GraphQLCVSectionInput) },
  },
})
