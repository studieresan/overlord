import * as bcrypt from 'bcrypt-nodejs'
import * as mongoose from 'mongoose'
import * as models from '../models'

export type UserDocument = mongoose.Document & models.User & {
    info: {
        email: string,
        password: string,
        passwordResetToken: string | undefined,
        passwordResetExpires: number | undefined,
    }

  comparePassword:
    (candidatePassword: string, cb: (err: any, isMatch: any) => {}) => void,
}

const userSchema: mongoose.Schema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  studsYear: Number,
  info: {
    role: String,
    password: String,
    passwordResetToken: String,
    passwordResetExpires: Number,
    email: String,
    position: String,
    linkedIn: String,
    github: String,
    phone: String,
    picture: String,
    allergies: String,
    master: String,
    permissions: [String],
  },
}, { timestamps: true })

/**
 * Password hash middleware.
 */
userSchema.pre('save', function save(this: UserDocument, next) {
  const user: UserDocument = this
  if (!user.isModified('info.password')) { return next() }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err) }
    bcrypt.hash(
      user.info.password,
      salt,
      undefined!,
      (err: mongoose.Error, hash: any) => {
      if (err) { return next(err) }
      user.info.password = hash
      next()
    })
  })
})

userSchema.methods.comparePassword =
  function (candidatePassword: string, cb: (err: any, isMatch: any) => {}) {
    bcrypt.compare(
      candidatePassword,
      this.info.password,
      (err: mongoose.Error, isMatch: boolean) => {
        cb(err, isMatch)
    })
  }

export const User = mongoose.model<UserDocument>('User', userSchema)
