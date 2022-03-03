import * as mongodb from '../mongodb/Blog'
import * as flatten from 'flat'
import { BlogActions } from './BlogActions'
import { Blog } from '../models'
import { CreateBlog } from '../models/Blog'

export class BlogActionsImpl implements BlogActions {

    createBlogPost(fields: Partial<CreateBlog>): Promise<Blog> {

        return new mongodb.Blog({
            ...fields,
        }).save()
            .then(book => book
                .populate('author')
                .execPopulate()
            )

    }

    // TODO...

    // deleteBlogPost(id: string): Promise<boolean> {

    // }

    // updateBlogPost(id: string, fields: Partial<Blog>): Promise<Blog> {
    //
    // }

    getBlogPosts(): Promise<Blog[]> {
        return mongodb.Blog.find()
        .populate('author')
        .exec()
    }
}