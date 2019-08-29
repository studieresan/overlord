import { CompanySalesStatus } from '../models'

export interface CompanySalesStatusActions {

  // Get all company sales statuses
  getCompanySalesStatuses(res: any, req: any): Promise<CompanySalesStatus[]>

}
