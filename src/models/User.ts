export interface User {
  readonly id: string
  firstName: string
  lastName: string
  studsYear: number
  info: UserInfo
  permissions: Permission[]
}

export type UserInfo = StudsInfo

export interface StudsInfo {
  readonly userRole: UserRole
  readonly email: string
  readonly linkedIn?: string
  readonly github?: string
  readonly phone?: string
  readonly picture?: string
  readonly allergies?: string
  readonly master?: string
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
