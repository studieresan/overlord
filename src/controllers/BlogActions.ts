import { CreateBlog } from '../models/Blog'
import { Blog } from '../models'
export interface BlogActions {
    // Get all blogposts
    getBlogPosts(): Promise<Blog[]>

    // Create a new blog post
    createBlogPost(fields: Partial<CreateBlog>): Promise<Blog>

    // Update the blog with given id
    // updateBlogPost(id: string, fields: Partial<Blog>): Promise<Blog>

    // Delete the blog with given id
    // deleteBlogPost(id: string): Promise<boolean>
}
