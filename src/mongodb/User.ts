import * as bcrypt from 'bcrypt-nodejs'
import * as mongoose from 'mongoose'
import * as models from '../models'

export type UserDocument = mongoose.Document & models.User & {
  email: string,
  password: string,
  passwordResetToken: string | undefined,
  passwordResetExpires: number | undefined,

  comparePassword:
    (candidatePassword: string, cb: (err: any, isMatch: any) => {}) => void,
}

const userSchema: mongoose.Schema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  passwordResetToken: String,
  passwordResetExpires: Number,

  permissions: [String],
  profile: {
    email: String,
    firstName: String,
    lastName: String,
    profile: String,
    alternativeProfile: String,
    position: String,
    linkedIn: String,
    github: String,
    phone: String,
    picture: String,
    allergies: String,
    master: String,
    userRole: String,
    resumeEmail: String,
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
