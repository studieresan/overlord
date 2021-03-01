import { Happening } from '../models'
import { HappeningCreate } from '../models/Happening'
export interface HappeningActions {
    // Get all happenings
    getHappenings(): Promise<Happening[]>

    // // Create a new event for company name
    // createHappening(fields: Partial<HappeningCreate>): Promise<Happening>

    // // Update the event with given id
    // updateHappening(id: string, fields: Partial<Event>): Promise<Happening>

    // // Update the event with given id
    // deleteHappening(id: string): Promise<boolean>
}
