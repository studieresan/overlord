import * as mongodb from '../mongodb/Happening'
import { HappeningActions } from './HappeningActions'
import { Happening } from '../models'
import { CreateHappening } from '../models/Happening'
import { rejectIfNull } from './util'

export class HappeningActionsImpl implements HappeningActions {
    getHappenings(): Promise<Happening[]> {
        return mongodb.Happening
            .find()
            .populate('host')
            .populate('participants')
            .exec()
    }

    // Create a new happening
    createHappening(fields: Partial<CreateHappening>): Promise<Happening> {
        return new mongodb.Happening({
            ...fields,
        }).save()
            .then(book => book
                .populate('host')
                .populate('participants')
                .execPopulate()
            )
    }

    // Update the happening with given id
    updateHappening(id: string, fields: Partial<Happening>): Promise<Happening> {
        return mongodb.Happening.findOneAndUpdate(
            { _id: id },
            { ...fields },
            { new: true }
        )
            .populate('host')
            .populate('participants')
            .exec()
            .then(rejectIfNull('Happening does not exist'))
    }

    // Delete the happening with given id
    deleteHappening(id: string): Promise<boolean> {
        return mongodb.Happening.findOneAndRemove({ _id: id })
            .then(happening => (happening !== undefined))
    }
}