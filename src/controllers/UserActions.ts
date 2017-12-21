import { UserProfile, MemberType } from '../models'

export interface UserActions {
  // Gets the profile of the user with the specified id
  getUserProfile(id: string): Promise<UserProfile>

  // Gets the profiles of all users with the specified membertype
  getUserProfiles(type: MemberType): Promise<UserProfile[]>

  // Update the specified fields of a user profile,
  // returning the modified profile
  setUserProfile(id: string, fields: Partial<UserProfile>): Promise<UserProfile>

}
