import {
  GraphQLScalarType,
} from 'graphql'

export const GraphQLDateTime = new GraphQLScalarType({
  name: 'DateTime',
  serialize(value) {
    return value.toJSON()
  },
  parseValue(value) {
    return new Date(value)
  },
  parseLiteral(ast: any) {
    return new Date(ast.value)
  },
})
