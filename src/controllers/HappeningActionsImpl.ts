import { HappeningActions } from './HappeningActions'
import { Happening } from '../models'
import * as mongodb from '../mongodb/Happening'

export class HappeningActionsImpl implements HappeningActions {
    getHappenings(): Promise<Happening[]> {
        return mongodb.Happening
            .find()
            .populate('host')
            .populate('participants')
            .exec()
    }
}