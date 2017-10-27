export interface User {
  readonly id: string
  readonly email: string
  readonly firstName: string
  readonly lastName: string
  readonly phone?: string
  readonly picture?: string
  readonly allergies?: string
  readonly master?: string
  readonly memberType: MemberType
}

export enum MemberType {
  StudsMember = 'studs_member',
  CompanyMember = 'company_member',
}
