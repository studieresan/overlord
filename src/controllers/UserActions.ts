import { User, UserProfile, MemberType } from '../models'

export interface UserActions {
  // Gets the profile of the user with the specified id
  getUserProfile(id: string): Promise<UserProfile>

  // Update the specified fields of a user profile,
  // returning the modified profile
  updateUserProfile(id: string, fields: Partial<UserProfile>):
    Promise<UserProfile>

  // Gets all users with the specified membertype
  getUsers(auth: User, type: MemberType): Promise<User[]>

}
