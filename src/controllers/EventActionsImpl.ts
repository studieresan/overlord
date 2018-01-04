import { EventActions } from './EventActions'
import { Event, User } from '../models'
import { rejectIfNull } from './util'
import * as mongodb from '../mongodb/Event'

export class EventActionsImpl implements EventActions {

  getEvents(auth: User): Promise<Event[]> {
    if (auth) {
      // All fields
      return mongodb.Event.find().exec()
    } else {
      // Public event
      return mongodb.Event.find({}, {
        'id': true,
        'companyName': true,
        'publicDescription': true,
        'date': true,
        'pictures': true,
      }).exec()
    }
  }

  createEvent(companyName: string, fields: Partial<Event>): Promise<Event> {
    return mongodb.Event.findOne({ companyName })
      .then(event => {
        if (event) {
          return event
        } else {
          const event = new mongodb.Event(fields)
          return event.save()
        }
      })
  }

  updateEvent(id: string, fields: Partial<Event>): Promise<Event> {
    return mongodb.Event.findOneAndUpdate(
      { id },
      { id, ...fields },
      { upsert: true, new: true }
    ).then(rejectIfNull('No event exists for given id'))
  }

}
