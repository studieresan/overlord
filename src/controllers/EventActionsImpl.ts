import { EventActions } from './EventActions'
import { Event, User } from '../models'
import { rejectIfNull, hasEventOrAdminPermissions } from './util'
import { Event as EventSchema } from '../mongodb/Event'
import { ObjectID } from 'mongodb'
import { CreateEvent } from '../models/Event'
export class EventActionsImpl implements EventActions {

  createEvent(requestUser: User, fields: Partial<CreateEvent>): Promise<Event> {
    if (!hasEventOrAdminPermissions(requestUser))
      return Promise.reject('Insufficient permissions')

    return new EventSchema({
      ...fields,
    }).save()
      .then(book => book
        .populate('author')
        .execPopulate()
      )
  }

  deleteEvent(requestUser: User, id: string): Promise<boolean> {
    if (!hasEventOrAdminPermissions(requestUser)) {
      return Promise.reject(new Error('User not authorized'))
    }
    return EventSchema.findOneAndRemove({ _id: id })
      .then(event => {
        return (event !== undefined)
      })
  }

  updateEvent(requestUser: User, id: string, fields: any): Promise<Event> {
    if (!hasEventOrAdminPermissions(requestUser))
      return Promise.reject('Insufficient permissions')
    return EventSchema.findOneAndUpdate(
      { _id: id },
      {
        responsible: fields.responsibleUserId ? new ObjectID(fields.responsibleUserId) : undefined,
        ...fields,
      },
      { new: true })
      .populate('author')
      .then(rejectIfNull('No event exists for given id'))
  }

  getEvents(studsYear: Number): Promise<Event[]> {
    const searchFilter: object = studsYear ? { studsYear: studsYear } : {}
    return EventSchema.find(searchFilter)
      .populate('author')
      .sort({ date: -1 })
      .exec()
  }

  getEvent(eventId: string): Promise<Event> {
    return EventSchema.findById(new ObjectID(eventId))
      .populate('author')
      .then(rejectIfNull('No event matches id'))
      .then(event => event)
  }

}
