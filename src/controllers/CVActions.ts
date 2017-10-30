import { CV } from '../models'

export interface CVActions {
  getCV(userId: string): Promise<CV>
  setCV(userId: string, fields: Partial<CV>): Promise<CV>
}
