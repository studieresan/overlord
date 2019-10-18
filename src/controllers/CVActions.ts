import { CV, User } from '../models'

export interface CVActions {
  getCV(userId: string): Promise<CV>
  updateCV(userId: string, fields: Partial<CV>): Promise<CV>
  getAllCVs(auth: User): Promise<CV[]>
}
