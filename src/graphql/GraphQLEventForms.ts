import {
  GraphQLInterfaceType,
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLEnumType,
  GraphQLString,
  GraphQLScalarType,
  GraphQLBoolean,
} from 'graphql'
import { Kind } from 'graphql/language'
import * as models from './../models'

function rating(value: number) {
  if (0 < value && value <= 5) {
    return value
  }

  return undefined
}

const RatingType = new GraphQLScalarType({
  name: 'Rating',
  serialize: rating,
  parseValue: rating,
  parseLiteral(ast) {
    if (ast.kind == Kind.INT) {
      return rating(parseInt(ast.value, 10))
    }
  },
})

export const EventImpactType = new GraphQLEnumType({
  name: 'EventImpactType',
  values: {
    POSITIVE: { value: models.EventImpact.Positive },
    NEUTRAL: { value: models.EventImpact.Neutral },
    NEGATIVE: { value: models.EventImpact.Negative },
  },
})

export const FamiliarityType = new GraphQLEnumType({
  name: 'FamiliarityType',
  values: {
    YES: { value: models.Familiarity.Yes },
    SOMEWHAT: { value: models.Familiarity.Somewhat },
    NO: { value: models.Familiarity.No },
  },
})

const CommonFormFields = {
  id: { type: GraphQLString },
  userId: { type: GraphQLString },
  eventId: { type: GraphQLString },
  createdAt: { type: GraphQLString },
  updatedAt: { type: GraphQLString },
}

const MutableFormFields = {
  interestInRegularWork: { type: RatingType },
  interestInThesisWork: { type: RatingType },
  lookingForThesisWork: { type: GraphQLBoolean },
  interestInCompanyMotivation: { type: GraphQLString },
}

const MutablePreEventFormFields = {
  ...MutableFormFields,
  familiarWithCompany: { type: FamiliarityType },
  viewOfCompany: { type: GraphQLString },
}

const MutablePostEventFormFields = {
  ...MutableFormFields,
  eventImpact: { type: EventImpactType },
  qualifiedToWork: { type: GraphQLBoolean },
  atmosphereRating: { type: RatingType },
  activitiesRating: { type: RatingType },
  foodRating: { type: RatingType },
  eventFeedback: { type: GraphQLString },
  eventImprovements: { type: GraphQLString },
}

export const EventFormType = new GraphQLInterfaceType({
  name: 'EventForm',
  fields: CommonFormFields,
})

export const PreEventFormType = new GraphQLObjectType({
  name: 'PreEventForm',
  interfaces: [EventFormType],
  fields: {
    ...CommonFormFields,
    ...MutablePreEventFormFields,
  },
  isTypeOf: data => !!data.familiarWithCompany,
})

export const PreEventFormInputType = new GraphQLInputObjectType({
  name: 'PreEventFormInputType',
  fields: MutablePreEventFormFields,
})

export const PostEventFormType = new GraphQLObjectType({
  name: 'PostEventForm',
  interfaces: [EventFormType],
  fields: {
    ...CommonFormFields,
    ...MutablePostEventFormFields,
  },
  isTypeOf: data => !!data.eventImpact,
})

export const PostEventFormInputType = new GraphQLInputObjectType({
  name: 'PostEventFormInputType',
  fields: MutablePostEventFormFields,
})
