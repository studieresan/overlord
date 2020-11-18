import { User, UserInfo, UserRole } from '../models'

export interface UserActions {
  // Gets the info of the user with the specified id
  getUserInfo(id: string): Promise<UserInfo>

  // Update the specified fields of a user info,
  // returning the modified info
  updateUserInfo(userID: string, requestUser: User, fields: Partial<UserInfo>):
    Promise<UserInfo>

  // Deletes the user info of a user from the database.
  // It is not possible to delete yourself
  deleteUser(userID: string, requestUser: User): Promise<User>

  // Gets all users with the specified user role and year
  getUsers(req: any, res: any, type: UserRole, studsYear: number): Promise<User[]>

}
