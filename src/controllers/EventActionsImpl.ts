import { EventActions } from './EventActions'
import { Event, User } from '../models'
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

}
