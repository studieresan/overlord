
export interface User {
  readonly id: string
  firstName: string
  lastName: string
  studsYear: number
  info: UserInfo
  tokens: string[]
}

export type UserInfo = StudsInfo

export interface StudsInfo {
  readonly role: UserRole
  readonly email: string
  readonly linkedIn?: string
  readonly github?: string
  readonly phone?: string
  readonly picture?: string
  readonly allergies?: string
  readonly master?: string,
  readonly permissions: Permission[]
}

export enum UserRole {
  ProjectManager = 'project_manager',
  ItGroup = 'it_group',
  ItGroupManager = 'it_group_manager',
  SalesGroup = 'sales_group',
  SalesGroupManager = 'sales_group_manager',
  EventGroup = 'event_group',
  EventGroupManager = 'event_group_manager',
  InfoGroup = 'info_group',
  InfoGroupManager = 'info_group_manager',
  FinanceGroup = 'finance_group',
  FinanceGroupManager = 'finance_group_manager',
  TravelGroup = 'travel_group',
  TravelGroupManager = 'travel_group_manager',
}

export enum Permission {
  Admin = 'admin_permission',
  Events = 'events_permission',
  Blog = 'blog_permission',
}
