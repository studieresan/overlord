import {
    GraphQLObjectType,
    GraphQLList,
    GraphQLInputObjectType,
    GraphQLString,
    GraphQLFloat,
} from 'graphql'

const GeoJSONGeometryType: GraphQLObjectType = new GraphQLObjectType({
    name: 'GeometryType',
    fields: () => ({
        type: { type: GraphQLString },
        coordinates: { type: new GraphQLList(GraphQLFloat) },
    }),
})

const GeoJSONGeometryInputType: GraphQLInputObjectType = new GraphQLInputObjectType({
    name: 'GeometryInputType',
    fields: () => ({
        type: { type: GraphQLString },
        coordinates: { type: new GraphQLList(GraphQLFloat) },
    }),
})

const GeoJSONPropertiesType: GraphQLObjectType = new GraphQLObjectType({
    name: 'PropertiesType',
    fields: () => ({
        name: { type: GraphQLString },
    }),
})

const GeoJSONPropertiesInputType: GraphQLInputObjectType = new GraphQLInputObjectType({
    name: 'PropertiesInputType',
    fields: () => ({
        name: { type: GraphQLString },
    }),
})

export const GeoJSONFeatureType: GraphQLObjectType = new GraphQLObjectType({
    name: 'GeoJSONFeatureType',
    fields: () => ({
        type: { type: GraphQLString },
        geometry: { type: GeoJSONGeometryType },
        properties: { type: GeoJSONPropertiesType },
    }),
})

export const GeoJSONFeatureInputType: GraphQLInputObjectType = new GraphQLInputObjectType({
    name: 'GeoJSONFeatureInputType',
    fields: () => ({
        type: { type: GraphQLString },
        geometry: { type: GeoJSONGeometryInputType },
        properties: { type: GeoJSONPropertiesInputType },
    }),
})