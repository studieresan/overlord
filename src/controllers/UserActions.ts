import { User, MemberType } from '../models'

export interface UserActions {

  // Get the user with the specified id
  getUser(id: string): Promise<User>

  // Get all users of the specified type
  getUsers(type: MemberType): Promise<User[]>

  // Update the specified fields of a User, returning the modified user
  setUser(id: string, fields: Partial<User>): Promise<User>

}
