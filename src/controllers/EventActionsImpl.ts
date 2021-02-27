import { EventActions } from './EventActions'
import { Event, User } from '../models'
import { rejectIfNull, hasEventOrAdminPermissions } from './util'
import * as eventMongo from '../mongodb/Event'
import * as companyMongo from '../mongodb/Company'
import * as passport from 'passport'
import { ObjectID } from 'mongodb'
import { CreateEvent } from '../models/Event'

export class EventActionsImpl implements EventActions {

  getEvents(req: any, res: any, studsYear: number): Promise<Event[]> {
    return new Promise<Event[]>((resolve, reject) => {
      passport.authenticate('jwt', { session: false },
        (err: any, user: any, info: any) => {
          if (err) {
            reject(Error(`Error occured when authenticating user: ${err}`))
          }

          const searchFilter = studsYear ? { studsYear: studsYear } : {}

          if (user) {
            // All fields
            resolve(eventMongo.Event.find(searchFilter)
            .populate('company')
            .populate('responsible')
            .sort([['date', 'descending']])
            .exec())
          } else {
            // Public event
            resolve(eventMongo.Event.find(searchFilter,
              {
                'id': true,
                'company': true,
                'responsible': true,
                'publicDescription': true,
                'date': true,
                'pictures': true,
                'published': true,
                'studsYear': true,
              }
            ).populate('company')
             .populate('responsible')
             .sort([['date', 'descending']])
             .exec())
          }
        }
      )(req, res, () => {})
    })
  }

  getEvent(eventId: string): Promise<Event> {
    return eventMongo.Event.findById(new ObjectID(eventId))
      .populate('company')
      .populate('responsible')
      .then(rejectIfNull('No event matches id'))
      .then(event => event)
  }

  createEvent(requestUser: User, fields: Partial<CreateEvent>):
    Promise<Event> {
    if (!hasEventOrAdminPermissions(requestUser))
      return Promise.reject('Insufficient permissions')
    if (!fields.companyId)
      return Promise.reject('No company ID')

    return companyMongo.Company.findById(fields.companyId!)
      .then(rejectIfNull('No company with ID'))
      .then(() => {
        const event = new eventMongo.Event({
          company: new ObjectID(fields.companyId),
          responsible: fields.responsibleUserId ? new ObjectID(fields.responsibleUserId)
            : undefined,
          ...fields,
        })
        return event.save()
      }).then(event => event
                      .populate('company')
                      .populate('responsible')
                      .execPopulate()
    )
  }

  updateEvent(requestUser: User, id: string, fields: Partial<Event>): Promise<Event> {
    if (!hasEventOrAdminPermissions(requestUser))
      return Promise.reject('Insufficient permissions')
    return eventMongo.Event.findOneAndUpdate(
      { _id: id },
      {
         ...fields,
    },
      { new: true }
    ).then(rejectIfNull('No event exists for given id'))
  }

  deleteEvent(requestUser: User, id: string): Promise<boolean> {
    if (!hasEventOrAdminPermissions(requestUser)) {
      return Promise.reject(new Error ('User not authorized'))
    }
    return eventMongo.Event.findOneAndRemove({ _id: id })
      .then(event => {
        return (event !== undefined)
      })
  }

  checkIn(auth: User, id: string): Promise<boolean> {
    return eventMongo.Event.findOneAndUpdate(
      { _id: id },
      { $addToSet: {checkedInUsers: auth.id}, $pull: {notCheckedInUsers: auth.id} },
      { new: true }
    ).then(rejectIfNull('No event exists for given id')).then(event => {
      return (event != undefined)
    })
  }

  getOldEvents(): Promise<Event[]> {
    return new Promise<Event[]>(resolve => {
      resolve(eventMongo.OldEvent.find({},
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
