import * as bcrypt from 'bcrypt-nodejs'
import * as mongoose from 'mongoose'
import { UserProfile } from '../models'

export type UserDocument = mongoose.Document & {
  email: string,
  password: string,
  passwordResetToken: string | undefined,
  passwordResetExpires: number | undefined,
  profile: UserProfile,

  comparePassword:
    (candidatePassword: string, cb: (err: any, isMatch: any) => {}) => void,
}

const userSchema: mongoose.Schema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  passwordResetToken: String,
  passwordResetExpires: Number,

  profile: {
    email: String,
    firstName: String,
    lastName: String,
    profile: String,
    position: String,
    phone: String,
    picture: String,
    allergies: String,
    master: String,
    memberType: String,
  },
}, { timestamps: true })

/**
 * Password hash middleware.
 */
userSchema.pre('save', function save(this: UserDocument, next) {
  const user: UserDocument = this
  if (!user.isModified('password')) { return next() }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err) }
    bcrypt.hash(
      user.password,
      salt,
      undefined!,
      (err: mongoose.Error, hash: any) => {
      if (err) { return next(err) }
      user.password = hash
      next()
    })
  })
})

userSchema.methods.comparePassword =
  function (candidatePassword: string, cb: (err: any, isMatch: any) => {}) {
    bcrypt.compare(
      candidatePassword,
      this.password,
      (err: mongoose.Error, isMatch: boolean) => {
        cb(err, isMatch)
    })
  }

export const User = mongoose.model<UserDocument>('User', userSchema)
