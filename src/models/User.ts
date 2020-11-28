import { CV } from './CV'

export interface User {
  readonly id: string
  firstName: string
  lastName: string
  studsYear: number
  info: UserInfo
}

export type UserInfo = StudsInfo

export interface StudsInfo {
  userRole: UserRole
  email: string
  linkedIn?: string
  github?: string
  phone?: string
  picture?: string
  allergies?: string
  master?: string,
  cv?: CV,
  permissions: Permission[]
}

export enum UserRole {
  ProjectManager = 'project_manager',
  ItGroup = 'it_group',
  SalesGroup = 'sales_group',
  EventGroup = 'event_group',
  InfoGroup = 'info_group',
  FinanceGroup = 'finance_group',
  TravelGroup = 'travel_group',
}

export enum Permission {
  Admin = 'admin_permission',
  Events = 'events_permission',
}
