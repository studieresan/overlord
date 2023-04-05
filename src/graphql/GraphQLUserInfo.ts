import {
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLEnumType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
} from 'graphql'
import * as models from '../models'

export const UserRole = new GraphQLEnumType({
  name: 'UserRole',
  values: {
    'project_manager': { value: models.UserRole.ProjectManager },
    'it_group': { value: models.UserRole.ItGroup },
    'it_group_manager': { value: models.UserRole.ItGroupManager },
    'sales_group': { value: models.UserRole.SalesGroup },
    'sales_group_manager': { value: models.UserRole.SalesGroupManager },
    'event_group': { value: models.UserRole.EventGroup },
    'event_group_manager': { value: models.UserRole.EventGroupManager },
    'info_group': { value: models.UserRole.InfoGroup },
    'info_group_manager': { value: models.UserRole.InfoGroupManager },
    'finance_group': { value: models.UserRole.FinanceGroup },
    'finance_group_manager': { value: models.UserRole.FinanceGroupManager },
    'travel_group': { value: models.UserRole.TravelGroup },
    'travel_group_manager': { value: models.UserRole.TravelGroupManager },
  },
})


const InfoFields = {
  email: { type: GraphQLString },
  phone: { type: GraphQLString },
  biography: { type: GraphQLString },
  linkedIn: { type: GraphQLString },
  github: { type: GraphQLString },
  master: { type: GraphQLString },
  allergies: { type: GraphQLString },
  picture: { type: GraphQLString },
  role: { type: GraphQLString },
  permissions: { type: new GraphQLList(GraphQLString) },
};

export const UserInfoType = new GraphQLObjectType({
  name: 'UserInfo',
  fields: {
    ...InfoFields,
  },
});

const UserInfoInputType = new GraphQLInputObjectType({
  name: 'UserInfoInput',
  fields: {
    ...InfoFields,
  },
});

export const UserTypeInput = new GraphQLInputObjectType({
  name: 'UserTypeInput',
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    studsYear: { type: GraphQLInt },
    info: { type: UserInfoInputType },
  }),
});
