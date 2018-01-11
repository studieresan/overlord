import { Event, User } from '../models'

export interface EventActions {

  // Get all events
  getEvents(auth: User): Promise<Event[]>

  // Create a new event for company name
  createEvent(auth: User, companyName: string, fields: Partial<Event>):
    Promise<Event>

  // Update the event with given id
  updateEvent(auth: User, id: string, fields: Partial<Event>): Promise<Event>

}
