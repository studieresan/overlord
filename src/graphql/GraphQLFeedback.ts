import {
  MultipleChoice,
  Scale,
  OpenEnded,
} from '../models/Feedback'
import {
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLUnionType,
} from 'graphql'

const AlternativeType = new GraphQLObjectType({
  name: 'Alternative',
  fields: {
    alternative: { type: GraphQLString },
    amount: { type: GraphQLInt },
  },
})

const MultipleChoiceType = new GraphQLObjectType({
  name: 'MultipleChoice',
  fields: {
    question: { type: GraphQLString },
    alternatives: { type: new GraphQLList(AlternativeType) },
  },
})

const ScaleType = new GraphQLObjectType({
  name: 'Scale',
  fields: {
    question: { type: GraphQLString },
    from: { type: GraphQLString },
    to: { type: GraphQLString },
    alternatives: { type: new GraphQLList(AlternativeType) },
  },
})

const OpenEndedType = new GraphQLObjectType({
  name: 'OpenEnded',
  fields: {
    question: { type: GraphQLString },
    answers: { type: new GraphQLList(GraphQLString) },
  },
})

const QuestionType = new GraphQLUnionType({
  name: 'Question',
  types: [MultipleChoiceType, ScaleType, OpenEndedType],
  resolveType(value: MultipleChoice | Scale | OpenEnded) {
    switch (value.type) {
      case 'multipleChoice':
        return MultipleChoiceType
      case 'scale':
        return ScaleType
      case 'openEnded':
        return OpenEndedType
    }
  },
})

export const FeedbackType = new GraphQLObjectType({
  name: 'Feedback',
  fields: {
    companyId: { type: GraphQLString },
    eventId: { type: GraphQLString },
    questions: { type: new GraphQLList(QuestionType) },
  },
})
