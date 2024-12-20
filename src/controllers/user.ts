import * as async from 'async'
import * as crypto from 'crypto'
import * as passport from 'passport'
import * as jwt from 'jsonwebtoken'
import { User, UserDocument } from '../mongodb/User'
import { UserRole, Permission, User as UserType } from '../models'
import { Request, Response, NextFunction } from 'express'
import { LocalStrategyInfo } from 'passport-local'
import { CallbackError } from 'mongoose'
import { Email } from './SendEmail'
import { SendEmailImpl } from './SendEmailImpl'
const host = process.env.DEV === 'false' ?
  `https://studs.se` :
  'http://localhost:5173'

const generateRandomPassword = async () => {
  const buf = await crypto.randomBytes(16)
  return buf.toString('hex')
}

/**
 * POST /login
 * Sign in using email and password.
 */
export let postLogin = (req: Request, res: Response, next: NextFunction) => {
  req.assert('email', 'Email is not valid').isEmail()
  req.assert('password', 'Password cannot be blank').notEmpty()
  req.sanitize('email').normalizeEmail({ gmail_remove_dots: false })

  const errors = req.validationErrors()

  if (errors) {
    return res.status(400).json(errors).end()
  }

  passport.authenticate('local', { session: false },
    (err: Error, user: any, info: LocalStrategyInfo) => {
      if (err) { return next(err) }

      if (!user) {
        console.log(`Invalid login attempt for ${req.body.email}.`)
        return res.status(401).json({ error: 'Wrong email or password.' })
      }

      const token = jwt.sign(user.info.email, process.env.JWT_SECRET!)
      res.status(200)
      res.setHeader('Authorization', `Bearer ${token}`)
      res.json({
        id: user.id,
        email: user.info.email,
        token,
        name: `${user.firstName} ${user.lastName}`,
        phone: user.info.phone || undefined,
        picture: user.info.picture || undefined,
        permissions: user.info.permissions,
      })
      res.end()
    })(req, res, next)
}

/**
 * PUT /account/password
 * Update current password.
 */
export const postDelete = (req: Request, res: Response, next: NextFunction) => {
  req.assert('toDeleteId', 'Id is required').notEmpty()
  const errors = req.validationErrors()

  if (errors) {
    res.status(400)
    return res.json(errors).end()
  }
  User.findById((req?.user as UserType)?.id, (err, user: UserDocument) => {

    if (err) { return next(err) }
    if (!user.info.permissions.includes(Permission.Admin)) {
      res.status(401)
      return res.json({ error: 'Unauthorized' }).end()
    }
    User.findById(req.body.toDeleteId, (err, userToDelete: UserDocument) => {
      if (err) { return next(err) }
      if (!userToDelete) {
        res.status(404)
        return res.json({ error: 'User not found' }).end()
      }
      userToDelete.remove({}, (err) => {
        if (err) {
          return next(err);
        }
        res.status(200).json({ message: 'User deleted successfully' }).end();
      })
    })
  })
}

/**
 * POST /signup
 * Create a new local account.
 */
// tslint:disable-next-line:max-line-length
export let postSignup = async (req: Request, res: Response, next: NextFunction) => {
  console.log('postSignup');

  req.assert('info.email', 'Email is not valid').isEmail();
  req.assert('firstName', 'First name is required').notEmpty();
  req.assert('lastName', 'Last name is required').notEmpty();
  req.assert(
    'info.role',
    'Role was invalid'
  ).isIn([
    UserRole.SalesGroup,
    UserRole.SalesGroupManager,
    UserRole.TravelGroup,
    UserRole.TravelGroupManager,
    UserRole.ProjectManager,
    UserRole.InfoGroup,
    UserRole.InfoGroupManager,
    UserRole.FinanceGroup,
    UserRole.FinanceGroupManager,
    UserRole.ItGroup,
    UserRole.ItGroupManager,
    UserRole.EventGroup,
    UserRole.EventGroupManager,
  ])
  req.sanitize('email').normalizeEmail({ gmail_remove_dots: false })

  const errors = req.validationErrors()
  if (errors) {
    res.status(400).json(errors).end()
    return
  }

  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    studsYear: req.body.studsYear,
    info: {
      ...req.body.info,
      password: await generateRandomPassword(),
    },
  })

  User.findOne({ 'info.email': req.body.info.email }, (err, existingUser) => {
    if (err) { return next(err) }
    if (existingUser) {
      res.status(400)
      res.json({ error: 'Account with that email address already exists.' })
      res.end()
      return
    } else {
      createAndSaveUser(req, res, user, next)
    }
  })
}

/**
 * Creates and saves a user.
 * An email verification is sent to the user upon completion.
 */
// tslint:disable-next-line:max-line-length
const createAndSaveUser = (req: Request, res: Response, user: UserDocument, next: NextFunction) => {
  async.waterfall([
    function createRandomToken(done: Function) {
      crypto.randomBytes(16, (err, buf) => {
        const token = buf.toString('hex')
        done(err, token, user)
      })
    },
    function setRandomToken(token: string, user: UserDocument, done: Function) {
      user.info.passwordResetToken = token
      user.info.passwordResetExpires = Date.now() + 1000 * 60 * 60 * 72 // 72 hours
      user.save((err: CallbackError) => {
        done(err, token, user)
      })
    },
    function loginUser(token: String, user: UserDocument, done: Function) {
      req.logIn(user, (err) => {
        if (err) {
          done(err, token, user)
          return next(err)
        } else {
          res.status(201)
          res.json({
            id: user.id,
            email: user.info.email,
          })
          res.end()
          done(err, token, user)
        }
      })
    },
    // tslint:disable-line:max-line-length
    function sendAccountCreatedEmail(token: String, user: UserDocument) {
      const mailOptions = {
        to: user.info.email,
        from: 'it@studs.se',
        subject: 'Welcome to Studieresan!',
        body:
          `Hi ${user.firstName}!\n\n` +
          // tslint:disable-next-line:max-line-length
          `You are receiving this email because you've been given an account at Studieresan. ` +
          // tslint:disable-next-line:max-line-length
          `Please proceed to the following link to complete the process: ${host}/auth/reset-password/${token}\n\n` +
          // tslint:disable-next-line:max-line-length
          `The link is valid for 72 hours. After that you will have to manually reset your password at ${host}/user/forgot-password.\n\n` +
          `Your username is ${user.info.email}.\n\n` +
          `Thank you!\n` +
          `Studieresan\n`,
      }
      new SendEmailImpl().sendEmail(mailOptions)
    },
  ])
}

/**
 * PUT /account/password
 * Update current password.
 */
export const putUpdatePassword =
  (req: Request, res: Response, next: NextFunction) => {

    req.assert(
      'password',
      'Password must be at least 4 characters long'
    ).len({ min: 4 })
    req.assert(
      'confirmPassword',
      'Passwords do not match'
    ).equals(req.body.password)

    const errors = req.validationErrors()

    if (errors) {
      res.status(400)
      return res.json(errors).end()
    }

    User.findById((req?.user as UserType)?.id, (err, user: UserDocument) => {
      if (err) { return next(err) }
      user.info.password = req.body.password
      user.save((err: CallbackError) => {
        if (err) { return next(err) }
        res.status(200)
        res.json({}).end()
      })
    })
  }

/**
 * POST /reset/:token
 * Process the reset password request.
 */
export let postReset = (req: Request, res: Response, next: NextFunction) => {
  req.assert(
    'password',
    'Password must be at least 4 characters long.'
  ).len({ min: 4 })
  req.assert(
    'confirmPassword',
    'Passwords must match.'
  ).equals(req.body.password)

  const errors = req.validationErrors()

  if (errors) {
    const ERROR_MSG = 'Passwords must be at least 4 characters long and match.'
    res.status(400).json({ error: ERROR_MSG }).end()
    return
  }
  async.waterfall([
    function resetPassword(done: Function) {
      User
        .findOne({ 'info.passwordResetToken': req.params.token })
        .where('info.passwordResetExpires').gt(Date.now())
        .exec((err: CallbackError, user: UserDocument | null) => {
          if (err) { return next(err) }
          if (!user) {
            const ERROR_MSG = 'Are you sure you have a valid token?'
            res.status(400).json({ error: ERROR_MSG }).end()
            return
          }
          user.info.password = req.body.password
          user.info.passwordResetToken = undefined
          user.info.passwordResetExpires = undefined
          user.save((err: CallbackError) => {
            if (err) { return next(err) }
            req.logIn(user, (err) => {
              done(err, user)
            })
          })
        })
    },
    function sendResetPasswordEmail(user: UserDocument, done: Function) {
      const mailOptions: Email = {
        to: user.info.email,
        from: 'it@studs.se',
        subject: 'Your password has been changed',
        body: `Hello,`
          + `\n\nThis is a confirmation that the password for your `
          + `account ${user.info.email} has just been changed.\n`,
      }
      new SendEmailImpl().sendEmail(mailOptions)
    },
  ], (err) => {
    if (err) {
      return res.sendStatus(500)
    } else {
      res.status(200)
      res.json({})
      return res.end()
    }
  })
}

/**
 * POST /forgot
 * Create a random token, then the send user an email with a reset link.
 */
export let postForgot = (req: Request, res: Response, next: NextFunction) => {
  const ERROR_MSG = 'Please enter a valid email address.'
  req.assert('email', ERROR_MSG).isEmail()
  req.sanitize('email').normalizeEmail({ gmail_remove_dots: false })

  const errors = req.validationErrors()

  if (errors) {
    res.status(400).json({ error: ERROR_MSG }).end()
    return
  }

  async.waterfall([
    function createRandomToken(done: Function) {
      crypto.randomBytes(16, (err, buf) => {
        const token = buf.toString('hex')
        done(err, token)
      })
    },
    function setRandomToken(token: string, done: Function) {
      User.findOne({ 'info.email': req.body.email }, (err, user: UserDocument) => {
        if (err) { return done(err) }
        if (!user) {
          const ERROR_MSG = 'Could not find account'
          res.status(400).json({ error: ERROR_MSG }).end()
          return
        }
        user.info.passwordResetToken = token
        user.info.passwordResetExpires = Date.now() + 3600000 // 1 hour
        user.save((err: CallbackError) => {
          done(err, token, user)
        })
      })
    },
    function sendForgotPasswordEmail(
      token: string, user: UserDocument, done: Function) {
      const mailOptions = {
        to: user.info.email,
        from: 'it@studs.se',
        subject: 'Reset your password on Studieresan.se',
        body:
          `You are receiving this email because you have `
          + `requested the reset of the password for your Studs account.\n\n`
          + `Please click on the following link, or paste it into your browser ` // tslint:disable-line:max-line-length
          + `to complete the process:\n\n`
          + `${host}/auth/reset-password/${token}\n\n`
          + `This link is valid for one hour. `
          + `After that you will have to reset again. `
          + `If you did not request a password change, `
          + `please ignore this email and your `
          + `password will remain unchanged.\n`,
      }
      new SendEmailImpl().sendEmail(mailOptions)
    },
  ], (err) => {
    if (err) {
      return res.sendStatus(500)
    } else {
      res.status(200)
      res.json({})
      return res.end()
    }
  })
}
