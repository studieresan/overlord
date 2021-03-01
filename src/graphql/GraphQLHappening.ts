import {
    GraphQLObjectType,
    GraphQLList,
    GraphQLInputObjectType,
    GraphQLString,
    GraphQLID,
} from 'graphql'
import { GraphQLDateTime } from './GraphQLDateTime'
import { GeoJSONFeatureType, GeoJSONFeatureInputType } from './GraphQLGeoJSON'
import { UserType } from './GraphQLUser'

const MutableHappeningFields = {
    title: { type: GraphQLString },
    emoji: { type: GraphQLString },
    description: { type: GraphQLString },
    participants: { type: new GraphQLList(UserType) },
    created: { type: GraphQLDateTime },
}

export const HappeningType: GraphQLObjectType = new GraphQLObjectType({
    name: 'Happening',
    fields: () => ({
        id: { type: GraphQLID },
        host: { type: UserType },
        location: { type: GeoJSONFeatureType },
        ...MutableHappeningFields,
    }),
})

export const HappeningInputType = new GraphQLInputObjectType({
    name: 'HappeningInput',
    fields: () => ({
        hostId: { type: GraphQLID },
        location: { type: GeoJSONFeatureInputType },
        ...MutableHappeningFields,
    }),
})
