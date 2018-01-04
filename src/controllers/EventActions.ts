import { Event, User } from '../models'

export interface EventActions {

  // Get all events
  getEvents(auth: User): Promise<Event[]>

}
