import { CreateEvent } from '../models/Event'
import { Event, User } from '../models'
export interface EventActions {

  // Get all events
  getEvents(res: any, req: any, studsYear: number): Promise<Event[]>

  // Get a specific event
  getEvent(eventId: string): Promise<Event>

  // Create a new event for company name
  createEvent(requestUser: User, fields: Partial<CreateEvent>):
    Promise<Event>

  // Update the event with given id
  updateEvent(requestUser: User, id: string, fields: Partial<Event>): Promise<Event>

  // Update the event with given id
  deleteEvent(requestUser: User, id: string): Promise<boolean>

  // Checks in user to the event with the given id
  checkIn(auth: User, id: string): Promise<boolean>

}
