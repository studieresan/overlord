import {
  GraphQLScalarType,
} from 'graphql'

export const GraphQLDateTime = new GraphQLScalarType({
  name: 'DateTime',
  serialize(value) {
    console.log("Value:", value);
    console.log('Serializing value:', value, 'Serialized value:', value.toJSON())
    return value.toJSON()
  },
  parseValue(value) {
    console.log('Parsing value:', value)
    return new Date(value)
  },
  parseLiteral(ast: any) {
    console.log('Parsing literal:', ast.value)
    return new Date(ast.value)
  },
})
