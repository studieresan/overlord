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
  GraphQLScalarType,
  isValidJSValue,
  valueFromAST,
  GraphQLError,
} from 'graphql'

// -----------
// Alternative
// -----------
const AlternativeFields = {
  alternative: { type: GraphQLString },
  amount: { type: GraphQLInt },
}

const AlternativeType = new GraphQLObjectType({
  name: 'Alternative',
  fields: {
    ...AlternativeFields,
  },
})

const AlternativeInputType = new GraphQLInputObjectType({
  name: 'AlternativeInput',
  fields: {
    ...AlternativeFields,
  },
})

// -----------
// Multiple Choice Question
// -----------
const MultipleChoiceType = new GraphQLObjectType({
  name: 'MultipleChoice',
  fields: {
    question: { type: GraphQLString },
    alternatives: { type: new GraphQLList(AlternativeType) },
    type: { type: GraphQLString },
  },
})

const MultipleChoiceInputType = new GraphQLInputObjectType({
  name: 'MultipleChoiceInput',
  fields: {
    question: { type: GraphQLString },
    alternatives: { type: new GraphQLList(AlternativeInputType) },
    type: { type: GraphQLString },
  },
})

// -----------
// Scale Question
// -----------
const ScaleFields = {
  question: { type: GraphQLString },
  from: { type: GraphQLString },
  to: { type: GraphQLString },
  type: { type: GraphQLString },
}

const ScaleType = new GraphQLObjectType({
  name: 'Scale',
  fields: {
    ...ScaleFields,
    alternatives: { type: new GraphQLList(AlternativeType) },
  },
})

const ScaleInputType = new GraphQLInputObjectType({
  name: 'ScaleInput',
  fields: {
    ...ScaleFields,
    alternatives: { type: new GraphQLList(AlternativeInputType) },
  },
})

// -----------
// Open Ended Question
// -----------
const OpenEndedFields = {
  question: { type: GraphQLString },
  answers: { type: new GraphQLList(GraphQLString) },
  kind: { type: GraphQLString },
}

const OpenEndedType = new GraphQLObjectType({
  name: 'OpenEnded',
  fields: {
    ...OpenEndedFields,
  },
})

const OpenEndedInputType = new GraphQLInputObjectType({
  name: 'OpenEndedInput',
  fields: {
    ...OpenEndedFields,
  },
})

// -----------
// Question
// -----------
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

// A scalar type that acts as an input union type
// Checks a question for the property 'kind' to determine what kind
// of question it is.
// GraphQL did not support union input types when this was written.
const QuestionInputType = new GraphQLScalarType({
  name: 'QuestionInput',
  serialize(value) {
    return value
  },
  parseValue(value: MultipleChoice | Scale | OpenEnded) {
    const valueIfValid = (inputType: GraphQLInputObjectType) => {
      if (isValidJSValue(value, inputType).length === 0) {
        return value
      }
    }
    switch (value.type) {
      case 'multipleChoice':
        return valueIfValid(MultipleChoiceInputType)
      case 'scale':
        return valueIfValid(ScaleInputType)
      case 'openEnded':
        return valueIfValid(OpenEndedInputType)
    }
    throw new GraphQLError('Invalid question format. ' +
      'Did you include the \'kind\' property?')
  },
  parseLiteral(ast: any) {
    switch (ast.fields[0].value.value) {
      case 'multipleChoice':
        return valueFromAST(ast, MultipleChoiceInputType)
      case 'scale':
        return valueFromAST(ast, ScaleInputType)
      case 'openEnded':
        return valueFromAST(ast, OpenEndedInputType)
    }
    throw new GraphQLError('Invalid question format. ' +
      'Did you include the \'kind\' property?')
  },
})

// -----------
// Feedback
// -----------
export const FeedbackType = new GraphQLObjectType({
  name: 'Feedback',
  fields: {
    companyId: { type: GraphQLString },
    eventId: { type: GraphQLString },
    questions: { type: new GraphQLList(QuestionType) },
  },
})

export const FeedbackInputType = new GraphQLInputObjectType({
  name: 'FeedbackInput',
  fields: {
    eventId: { type: GraphQLString },
    questions: { type: new GraphQLList(QuestionInputType) },
  },
})

