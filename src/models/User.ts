import * as bcrypt from 'bcrypt-nodejs'
import * as crypto from 'crypto'
import * as mongoose from 'mongoose'

import {
  GraphQLObjectType,
  GraphQLString
} from 'graphql'

export type UserModel = mongoose.Document & {
  email: string,
  password: string,
  passwordResetToken: string,
  passwordResetExpires: Date,

  tokens: AuthToken[],

  profile: {
    name: string,
    website: string,
    picture: string,
  },

  comparePassword: (candidatePassword: string, cb: (err: any, isMatch: any) => {}) => void,
  gravatar: (size: number) => string
}

export const UserType = new GraphQLObjectType({
  name : 'User',
  fields : {
    name:  { type: GraphQLString },
    email:  { type: GraphQLString },
    website:  { type: GraphQLString },
    picture:  { type: GraphQLString },
  }
})

export type AuthToken = {
  accessToken: string,
  kind: string
}

const userSchema: mongoose.Schema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  passwordResetToken: String,
  passwordResetExpires: Date,

  tokens: Array,

  profile: {
    name: String,
    website: String,
    picture: String
  }
}, { timestamps: true })

/**
 * Password hash middleware.
 */
userSchema.pre('save', function save(this: UserModel, next) {
  const user: UserModel = this
  if (!user.isModified('password')) { return next() }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err) }
    bcrypt.hash(user.password, salt, undefined!, (err: mongoose.Error, hash: any) => {
      if (err) { return next(err) }
      user.password = hash
      next()
    })
  })
})

userSchema.methods.comparePassword = function (candidatePassword: string, cb: (err: any, isMatch: any) => {}) {
  bcrypt.compare(candidatePassword, this.password, (err: mongoose.Error, isMatch: boolean) => {
    cb(err, isMatch)
  })
}


/**
 * Helper method for getting user's gravatar.
 */
userSchema.methods.gravatar = function (size: number) {
  if (!size) {
    size = 200
  }
  if (!this.email) {
    return `https://gravatar.com/avatar/?s=${size}&d=retro`
  }
  const md5 = crypto.createHash('md5').update(this.email).digest('hex')
  return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`
}

// export const User: UserType = mongoose.model<UserType>('User', userSchema)
const User = mongoose.model('User', userSchema)
export default User
