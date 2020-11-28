import {
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'

const MutableItemFields = {
  title: { type: GraphQLString },
  description: { type: GraphQLString },
  when: { type: GraphQLString },
  organization: { type: GraphQLString },
  city: { type: GraphQLString },
}

export const CVItemType = new GraphQLObjectType({
  name: 'CVItem',
  fields: {
    ...MutableItemFields,
  },
})

export const CVItemInputType = new GraphQLInputObjectType ({
  name: 'CVItemInput',
  fields: {
    ...MutableItemFields,
  },
})

const MutableCVSectionFields = {
	title: { type: GraphQLString },
	description: { type: GraphQLString },
}

export const CVSectionType = new GraphQLObjectType({
  name: 'CVSection',
  fields: {
    ...MutableCVSectionFields,
    items: { type: new GraphQLList(CVItemType) },
  },
})

export const CVSectionInputType = new GraphQLInputObjectType({
  name: 'CVSectionInput',
  fields: {
    ...MutableCVSectionFields,
    items: { type: new GraphQLList(CVItemInputType) },
  },
})

export const CVType = new GraphQLObjectType({
  name: 'CV',
  fields: {
    sections: { type: new GraphQLList(CVSectionType) },
  },
})

export const CVInputType = new GraphQLInputObjectType({
  name: 'CVInput',
  fields:  {
    sections: { type: new GraphQLList(CVSectionInputType) },
  },
})
