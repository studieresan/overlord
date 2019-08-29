import { CompanySalesStatusActions } from './CompanySalesStatusActions'
import { CompanySalesStatus } from '../models'
import { MemberType} from '../models'
import * as mongodb from '../mongodb/CompanySalesStatus'
import * as passport from 'passport'

export class CompanySalesStatusActionsImpl implements CompanySalesStatusActions {

    getCompanySalesStatuses(res: any, req: any): Promise<CompanySalesStatus[]> {
    
    return new Promise<CompanySalesStatus[]>((resolve, reject) => {
        console.log(passport)
        return resolve(mongodb.CompanySalesStatus.find({},
            {
              'status': true,
              'id': true,
            }
          ).exec())
      passport.authenticate('jwt', { session: false },
        (err: any, user: any, info: any) => {

          if (err) {
            reject(Error(`Error occured when authenticating user: ${err}`))
          }

          if (user && user.profile.memberType === MemberType.StudsMember) {
            // Public event
            resolve(mongodb.CompanySalesStatus.find({},
                {
                  'status': true,
                }
              ).exec())
          } else {
            reject(Error(`Not a studs member`))
          }
        }
      )(req, res, () => {})
    })
  }
}
