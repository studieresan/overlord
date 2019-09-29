import { CompanySalesStatusActions } from './CompanySalesStatusActions'
import { CompanySalesStatus } from '../models'
import * as mongodb from '../mongodb/CompanySalesStatus'

export class CompanySalesStatusActionsImpl implements CompanySalesStatusActions {
  getCompanySalesStatuses(res: any, req: any): Promise<CompanySalesStatus[]> {
    return new Promise<CompanySalesStatus[]>((resolve, reject) => {
      return resolve(mongodb.CompanySalesStatus.find({},
          {
            'name': true,
            'id': true,
            'priority': true,
          }
        ).sort([['priority', 'asc']]).exec())
    })
  }

  createSalesStatus(name: string): Promise<CompanySalesStatus> {
    const status = new mongodb.CompanySalesStatus({name})
    return status.save()
  }
}
