export interface User {
  readonly id: string
  profile: UserProfile
  permissions: Permission[]
}

export type UserProfile = StudsProfile | CompanyProfile

export interface StudsProfile {
  readonly memberType: MemberType.StudsMember
  readonly email: string
  readonly firstName: string
  readonly lastName: string
  readonly position?: string
  readonly linkedIn?: string
  readonly github?: string
  readonly phone?: string
  readonly picture?: string
  readonly allergies?: string
  readonly master?: string
}

export interface CompanyProfile {
  readonly memberType: MemberType.CompanyMember
  readonly email: string
  readonly firstName: string
  readonly lastName: string
  readonly companyName: string
}

export enum MemberType {
  StudsMember = 'studs_member',
  CompanyMember = 'company_member',
}

export enum Permission {
  Events = 'events_permission',
}
