export interface User {
  readonly id: string
  profile: UserProfile
  permissions: Permission[]
}

export type UserProfile = StudsProfile

export interface StudsProfile {
  readonly userRole: UserRole
  readonly studsYear: number
  readonly email: string
  readonly firstName: string
  readonly lastName: string
  readonly position?: string
  readonly linkedIn?: string
  readonly github?: string
  readonly phone?: string
  readonly picture?: string
  readonly alternativePicture?: string
  readonly allergies?: string
  readonly master?: string
  readonly resumeEmail: string
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
