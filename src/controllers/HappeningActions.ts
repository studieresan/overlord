import { Happening } from '../models'
import { CreateHappening } from '../models/Happening'
export interface HappeningActions {
    // Get all happenings
    getHappenings(): Promise<Happening[]>

    // Create a new happening
    createHappening(fields: Partial<CreateHappening>): Promise<Happening>

    // Update the happening with given id
    updateHappening(id: string, fields: Partial<Happening>): Promise<Happening>

    // Delete the happening with given id
    deleteHappening(id: string): Promise<boolean>
}
