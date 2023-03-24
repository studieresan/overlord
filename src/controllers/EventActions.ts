import { CreateEvent } from '../models/Event'
import { Event, User } from '../models'
export interface EventActions {
  // Get all events
  getEvents(studsYear: number): Promise<Event[]>

  // Get a specific event
  getEvent(eventId: string): Promise<Event>

  // Create a new event for company name
  createEvent(requestUser: User, fields: Partial<CreateEvent>):
    Promise<Event>

  // Update the event with given id
  updateEvent(requestUser: User, id: string, fields: Partial<Event>): Promise<Event>

  // Update the event with given id
  deleteEvent(requestUser: User, id: string): Promise<boolean>
}
