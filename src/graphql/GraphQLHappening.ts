import {
    GraphQLObjectType,
    GraphQLList,
    GraphQLInputObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
} from 'graphql'
import { GraphQLDateTime } from './GraphQLDateTime'
import { GeoJSONFeatureType, GeoJSONFeatureInputType } from './GraphQLGeoJSON'
import { UserType } from './GraphQLUser'

const MutableHappeningFields = {
    title: { type: GraphQLString },
    emoji: { type: GraphQLString },
    description: { type: GraphQLString },
}

export const HappeningType: GraphQLObjectType = new GraphQLObjectType({
    name: 'Happening',
    fields: () => ({
        id: { type: GraphQLID },
        host: { type: UserType },
        participants: { type: new GraphQLList(UserType) },
        location: { type: GeoJSONFeatureType },
        created: { type: GraphQLDateTime },
        ...MutableHappeningFields,
    }),
})

export const HappeningInputType = new GraphQLInputObjectType({
    name: 'HappeningInput',
    fields: () => ({
        host: { type: GraphQLID },
        participants: { type: new GraphQLList(GraphQLID) },
        location: { type: GeoJSONFeatureInputType },
        ...MutableHappeningFields,
    }),
})
