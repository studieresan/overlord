import { User } from '.'

export interface BlogFields {
    readonly id: string
    title: string
    description: string
    date: Date
    frontPicture: string
    studsYear: number
    pictures: string[]
    published: boolean
}

export interface Blog extends BlogFields {
    author: User
}

export interface CreateBlog extends BlogFields {
    author: string
}


