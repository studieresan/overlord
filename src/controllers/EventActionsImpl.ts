import { EventActions } from './EventActions'
import { Event, User } from '../models'
import { rejectIfNull, hasSufficientPermissions } from './util'
import * as mongodb from '../mongodb/Event'
import * as passport from 'passport'
import { ObjectID } from 'mongodb'

export class EventActionsImpl implements EventActions {

  getEvents(req: any, res: any): Promise<Event[]> {
    return new Promise<Event[]>((resolve, reject) => {
      passport.authenticate('jwt', { session: false },
        (err: any, user: any, info: any) => {
          if (err) {
            reject(Error(`Error occured when authenticating user: ${err}`))
          }

          if (user) {
            // All fields
            resolve(mongodb.Event.find().populate('company').populate('responsible').populate('checkedInUsers').exec())
          } else {
            // Public event
            resolve(mongodb.Event.find({},
              {
                'id': true,
                'company': true,
                'responsible': true,
                'publicDescription': true,
                'date': true,
                'pictures': true,
                'published': true,
              }
            ).populate('company')
             .populate('responsible')
             .exec())
          }
        }
      )(req, res, () => {})
    }).then(events => {
      return events
    })
  }

  createEvent(auth: User, companyId: string, responsibleUserId: string, fields: Partial<Event>):
    Promise<Event> {
    if (!hasSufficientPermissions(auth))
      return Promise.reject('Insufficient permissions')
    if (!companyId)
      return Promise.reject('Company must be specified')
    if (!responsibleUserId)
      return Promise.reject('Responsible user must be specified')
    const event = new mongodb.Event({
      company: new ObjectID(companyId),
      responsible: new ObjectID(responsibleUserId),
      ...fields,
    })
    return event.save().then(event =>
      event.populate('company').populate('responsible').execPopulate()
    )
  }

  updateEvent(auth: User, id: string, fields: Partial<Event>): Promise<Event> {
    if (!hasSufficientPermissions(auth))
      return Promise.reject('Insufficient permissions')
    return mongodb.Event.findOneAndUpdate(
      { _id: id },
      { ...fields },
      { new: true }
    ).then(rejectIfNull('No event exists for given id'))
  }

  removeEvent(id: string): Promise<boolean> {
    return mongodb.Event.findOneAndRemove({ _id: id })
      .then(event => {
        return (event != undefined)
      })
  }

  checkIn(auth: User, id: string): Promise<boolean> {
    return mongodb.Event.findOneAndUpdate(
      { _id: id },
      { $addToSet: {checkedInUsers: auth.id} },
      { new: true }
    ).then(rejectIfNull('No event exists for given id')).then(event => {
      return (event != undefined)
    })
  }

  getOldEvents(): Promise<Event[]> {
    return new Promise<Event[]>(resolve => {
      resolve(mongodb.OldEvent.find({},
          {
            'id': true,
            'companyName': true,
            'publicDescription': true,
            'date': true,
            'pictures': true,
            'published': true,
          }
      ).exec())
    })
  }
}
