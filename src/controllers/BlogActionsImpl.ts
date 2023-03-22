import * as mongodb from '../mongodb/Blog'
import * as flatten from 'flat'
import { BlogActions } from './BlogActions'
import { Blog, User } from '../models'
import { CreateBlog } from '../models/Blog'
import { hasBlogOrAdminPermissions, rejectIfNull } from './util'


export class BlogActionsImpl implements BlogActions {

    createBlogPost(requestUser: User, fields: Partial<CreateBlog>): Promise<Blog> {
        if (!hasBlogOrAdminPermissions(requestUser))
            return Promise.reject('Insufficient permissions')

        return new mongodb.Blog({
            ...fields,
        }).save()
            .then(book => book
                .populate('author')
                .execPopulate()
            )

    }

    deleteBlogPost(id: string): Promise<boolean> {
        console.log(JSON.stringify(id))
        return mongodb.Blog.findOneAndRemove({ _id: id })
            .then(post => (post !== undefined))

    }

    updateBlogPost(id: string, fields: Partial<CreateBlog>): Promise<Blog> {
        return mongodb.Blog.findOneAndUpdate(
            { _id: id },
            { ...flatten(fields) },
            { new: true })
            .populate('author')
            .exec()
            .then(rejectIfNull('Blog Post does not exist'))

    }

    getBlogPosts(): Promise<Blog[]> {
        return mongodb.Blog.find()
            .populate('author')
            .sort({ date: -1 })
            .exec()
    }
}