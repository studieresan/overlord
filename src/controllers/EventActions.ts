import { Event, User } from '../models'

export interface EventActions {

  // Get all events
  getEvents(res: any, req: any): Promise<Event[]>

  // Get a specific event
  getEvent(eventId: string): Promise<Event>

  // Get all old events. These contain only public info.
  getOldEvents(): Promise<Event[]>

  // Create a new event for company name
  createEvent(auth: User, companyId: string, responsibleUserId: string, fields: Partial<Event>):
    Promise<Event>

  // Update the event with given id
  updateEvent(auth: User, id: string, fields: Partial<Event>): Promise<Event>

  // Remove an event with the given id
  removeEvent(id: string): Promise<boolean>

  // Checks in user to the event with the given id
  checkIn(auth: User, id: string): Promise<boolean>

}
