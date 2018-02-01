import { Event, EventCheckIn, User } from '../models'

export interface EventActions {

  // Get all events
  getEvents(auth: User): Promise<Event[]>

  // Create a new event for company name
  createEvent(auth: User, companyName: string, fields: Partial<Event>):
    Promise<Event>

  // Update the event with given id
  updateEvent(auth: User, id: string, fields: Partial<Event>): Promise<Event>

  // Remove an event with the given id
  removeEvent(id: string): Promise<boolean>

  // Gets all check-ins for the event with the given id
  getCheckIns(auth: User, eventId: string): Promise<EventCheckIn[]>

  // Add a check-in for a user to the event with the given id
  addCheckIn(auth: User, eventId: string, userId: string):
    Promise<EventCheckIn>

  // Removes a check-in for a user to the event with the given id
  removeCheckIn(auth: User, eventId: string, userId: string):
    Promise<EventCheckIn>

}
