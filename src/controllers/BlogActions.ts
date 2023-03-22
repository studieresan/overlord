import { CreateBlog } from '../models/Blog'
import { Blog, User } from '../models'

export interface BlogActions {
    // Get all blog posts
    getBlogPosts(): Promise<Blog[]>

    // Create a new blog post
    createBlogPost(requestUser: User, fields: Partial<CreateBlog>): Promise<Blog>

    // Update the blog with given id
    updateBlogPost(id: string, fields: Partial<CreateBlog>): Promise<Blog>

    // Delete the blog with given id
    deleteBlogPost(id: string): Promise<boolean>
}
