import { Event, User } from '../models'

export interface EventActions {

  // Get all events
  getEvents(auth: User): Promise<Event[]>

  // Create a new event for company name
  createEvent(companyName: string, fields: Partial<Event>): Promise<Event>

  // Update the event with given id
  updateEvent(id: string, fields: Partial<Event>): Promise<Event>

  // Delete an event with the given id
  deleteEvent(id: string): Promise<void>

}
