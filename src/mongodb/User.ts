import * as bcrypt from 'bcrypt-nodejs'
import * as mongoose from 'mongoose'
import { User } from '../models'

export type UserModel = mongoose.Document & User & {
  email: string,
  password: string,

  comparePassword:
    (candidatePassword: string, cb: (err: any, isMatch: any) => {}) => void,
}

const userSchema: mongoose.Schema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,

  profile: {
    email: String,
    firstName: String,
    lastName: String,
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
userSchema.pre('save', function save(this: UserModel, next) {
  const user: UserModel = this
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

// export const User: UserType = mongoose.model<UserType>('User', userSchema)
const User = mongoose.model('User', userSchema)
export default User
