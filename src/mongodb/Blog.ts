import * as mongoose from 'mongoose'
import * as models from '../models'

export type BlogDocument = mongoose.Document & models.Blog

const BlogSchema: mongoose.Schema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  studsYear: Number,
  frontPicture: String,
  author: String,
  pictures: [String],
  published: {
    type: Boolean,
    default: false,
  },

}, { timestamps: { createdAt: 'created' } })

export const Blog = mongoose.model<BlogDocument>('Blog', BlogSchema, 'blogs')