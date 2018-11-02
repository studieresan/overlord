import { EventActions } from './EventActions'
import { Event, MemberType, Permission, User } from '../models'
import { rejectIfNull } from './util'
import * as mongodb from '../mongodb/Event'

export class EventActionsImpl implements EventActions {

  getEvents(auth: User): Promise<Event[]> {
    if (auth && auth.profile.memberType === MemberType.StudsMember) {
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
        'published': true,
      }).exec()
    }
  }

  createEvent(auth: User, companyName: string, fields: Partial<Event>):
    Promise<Event> {
    if (!EventActionsImpl.hasSufficientPermissions(auth))
      return Promise.reject('Insufficient permissions')
    const event = new mongodb.Event({
      companyName,
      ...fields,
    })
    return event.save()
  }

  updateEvent(auth: User, id: string, fields: Partial<Event>): Promise<Event> {
    if (!EventActionsImpl.hasSufficientPermissions(auth))
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

  private static hasSufficientPermissions(user: User): boolean {
    return user.permissions.includes(Permission.Events) ||
        user.permissions.includes(Permission.Admin)
  }
}
