import { User } from '.'

export interface BlogFields {
    readonly id: string
    title: string
    description: string
    date: Date
    studsYear: number
    pictures: string[]
    frontPicture: string
    published: boolean
}

export interface Blog extends BlogFields {
    author: User
}

export interface CreateBlog extends BlogFields {
    author_id: string
}


