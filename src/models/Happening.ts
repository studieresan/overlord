import { Feature } from 'geojson'
import { User } from '.'

interface HappeningFields {
    readonly id: string
    title: string
    emoji: string
    description: string
    location: Feature,
    created: Date,
}

export interface Happening extends HappeningFields {
    host: User
    participants: User[]
}

export interface CreateHappening extends HappeningFields {
    host: string
    participants: string[]
}