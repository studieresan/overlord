import { User, UserInfo, UserRole } from '../models'

export interface UserActions {
  // Gets the info of the user with the specified id
  getUserInfo(id: string): Promise<UserInfo>

  // Update the specified fields of a user info,
  // returning the modified info
  updateUserInfo(id: string, fields: Partial<UserInfo>):
    Promise<UserInfo>

  // Gets all users with the specified user role and year
  getUsers(req: any, res: any, type: UserRole, studsYear: number): Promise<User[]>

}
