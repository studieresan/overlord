import { EventActions } from './EventActions'
import { Event, EventCheckIn, User, Permission, MemberType } from '../models'
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
        'published': true,
      }).exec()
    }
  }

  createEvent(auth: User, companyName: string, fields: Partial<Event>):
    Promise<Event> {
    if (!auth.permissions.includes(Permission.Events))
      return Promise.reject('Insufficient permissions')
    const event = new mongodb.Event({
      companyName,
      ...fields,
    })
    return event.save()
  }

  updateEvent(auth: User, id: string, fields: Partial<Event>): Promise<Event> {
    if (!auth.permissions.includes(Permission.Events))
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

  getCheckIns(auth: User, eventId: string):
  Promise<EventCheckIn[]> {
    if (auth && auth.profile.memberType !== MemberType.StudsMember)
      return Promise.reject('Insufficient permissions')
    return mongodb.Event.findOne({ id: eventId })
    .then(rejectIfNull('No event exists for given event id'))
    .then(event => event.checkins)
  }

  addCheckIn(auth: User, eventId: string, userId: string):
    Promise<EventCheckIn> {
    if (auth && auth.profile.memberType !== MemberType.StudsMember)
      return Promise.reject('Insufficient permissions')
    return mongodb.Event.findOne({ _id: eventId })
    .then(rejectIfNull('No event exists for given event id'))
    .then(event => {
      const existingCheckin = event.checkins.find(c => c.userId === userId)
      if (existingCheckin) {
        return existingCheckin
      } else {
        const newCheckin = {
          'userId': userId,
          'checkedInAt': new Date(),
          'checkedInById': auth.id,
        }
        event.checkins = [...event.checkins, newCheckin]
        event.save()
        return newCheckin
      }
    })
  }

  removeCheckIn(auth: User, eventId: string, userId: string):
  Promise<EventCheckIn> {
    if (auth && auth.profile.memberType !== MemberType.StudsMember)
      return Promise.reject('Insufficient permissions')
    return mongodb.Event.findOne({ _id: eventId })
    .then(rejectIfNull('No event exists for given event id'))
    .then(event => {
      const existingCheckin = event.checkins.find(c => c.userId === userId)
      if (!existingCheckin) {
        throw('No check-in exists for user')
      } else {
        if (existingCheckin.userId != auth.id &&
          existingCheckin.checkedInById != auth.id) {
          throw('You can only remove your own check-ins')
        }
        event.checkins = event.checkins.filter(c => c !== existingCheckin)
        event.save()
        return existingCheckin
      }
    })
  }

}
