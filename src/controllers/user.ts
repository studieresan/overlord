import * as async from 'async'
import * as crypto from 'crypto'
import * as passport from 'passport'
import { default as User, UserModel } from '../mongodb/User'
import { MemberType } from '../models'
import { Request, Response, NextFunction } from 'express'
import { LocalStrategyInfo } from 'passport-local'
import { WriteError } from 'mongodb'

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

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
    console.log('errors')
    console.log(errors)
    console.log(req.body)
    return res.redirect('/login')
  }

  passport.authenticate( 'local',
    (err: Error, user: any, info: LocalStrategyInfo) => {
    if (err) { return next(err) }
    if (!user) {
      console.log('errors')
      console.log(errors)
      return res.redirect('/login')
    }
    req.logIn(user, (err) => {
      if (err) { return next(err) }
      res.status(200)
      res.json({
        id: user.id,
        email: user.email,
      })
      res.end()
    })
  })(req, res, next)
}

/**
 * GET /logout
 * Log out.
 */
export let logout = (req: Request, res: Response) => {
  if (req.session) {
    req.logout()
    req.session.destroy(() => {
      res.json({'loggedOut': true}).end()
    })
  }
}

/**
 * POST /signup
 * Create a new local account.
 */
export let postSignup = (req: Request, res: Response, next: NextFunction) => {
  req.assert('email', 'Email is not valid').isEmail()
  req.assert(
    'password',
    'Password must be at least 4 characters long'
  ).len({ min: 4 })
  req.assert(
    'confirmPassword',
    'Passwords do not match'
  ).equals(req.body.password)
  req.assert('firstName', 'First name is required').notEmpty()
  req.assert(
    'memberType',
    'memberType was invalid'
  ).isIn([MemberType.StudsMember, MemberType.CompanyMember])
  req.sanitize('email').normalizeEmail({ gmail_remove_dots: false })

  const errors = req.validationErrors()

  if (errors) {
    res.json(errors).end()
    return
  }

  const user = new User({
    email: req.body.email,
    password: req.body.password,
    profile: {
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName || '',
      memberType: req.body.memberType,
    },
  })

  User.findOne({ email: req.body.email }, (err, existingUser) => {
    if (err) { return next(err) }
    if (existingUser) {
      res.json( { error: 'Account with that email address already exists.' })
      res.end()
      return
    } else {
      user.save((err) => {
        if (err) { return next(err) }
        req.logIn(user, (err) => {
          if (err) {
            return next(err)
          }
          res.redirect('/')
        })
      })
    }
  })
}

/**
 * POST /account/password
 * Update current password.
 */
export const postUpdatePassword =
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

    User.findById(req.user.id, (err, user: UserModel) => {
      if (err) { return next(err) }
      user.password = req.body.password
      user.save((err: WriteError) => {
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
  req.assert('confirm', 'Passwords must match.').equals(req.body.password)

  const errors = req.validationErrors()

  if (errors) {
    return res.sendStatus(400)
  }

  async.waterfall([
    function resetPassword(done: Function) {
      User
        .findOne({ passwordResetToken: req.params.token })
        .where('passwordResetExpires').gt(Date.now())
        .exec((err, user: UserModel) => {
          if (err) { return next(err) }
          if (!user) {
            return res.sendStatus(400)
          }
          user.password = req.body.password
          user.passwordResetToken = undefined
          user.passwordResetExpires = undefined
          user.save((err: WriteError) => {
            if (err) { return next(err) }
            req.logIn(user, (err) => {
              done(err, user)
            })
          })
        })
    },
    function sendResetPasswordEmail(user: UserModel, done: Function) {
      const mailOptions = {
        to: user.email,
        from: 'studs-kommunikation@d.kth.se',
        subject: 'Your password has been changed',
        text: `Hello,`
        + `\n\nThis is a confirmation that the password for your `
        + `account ${user.email} has just been changed.\n`,
      }
      sgMail.send(mailOptions).then(() => done()).catch(done)
    },
  ], (err) => {
    if (err) {
      console.log(err)
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
  req.assert('email', 'Please enter a valid email address.').isEmail()
  req.sanitize('email').normalizeEmail({ gmail_remove_dots: false })

  const errors = req.validationErrors()

  if (errors) {
    return res.sendStatus(400)
  }

  async.waterfall([
    function createRandomToken(done: Function) {
      crypto.randomBytes(16, (err, buf) => {
        const token = buf.toString('hex')
        done(err, token)
      })
    },
    function setRandomToken(token: string, done: Function) {
      User.findOne({ email: req.body.email }, (err, user: UserModel) => {
        if (err) { return done(err) }
        if (!user) {
          return res.sendStatus(400)
        }
        user.passwordResetToken = token
        user.passwordResetExpires = Date.now() + 3600000 // 1 hour
        user.save((err: WriteError) => {
          done(err, token, user)
        })
      })
    },
    function sendForgotPasswordEmail(
      token: string, user: UserModel, done: Function) {
      const mailOptions = {
        to: user.email,
        from: 'studs-kommunikation@d.kth.se',
        subject: 'Reset your password on Studieresan.se',
        text:
        `You are receiving this email because you (or someone else) has `
        + `requested the reset of the password for your account.\n\n`
        + `Please click on the following link, or paste this into your browser `
        + `to complete the process:\n\n`
        + `http://${req.headers.host}/reset/${token}\n\n`
        + `If you did not request this, please ignore this email and your `
        + `password will remain unchanged.\n`,
      }
      sgMail.send(mailOptions).then(() => done()).catch(done)
    },
  ], (err) => {
    if (err) {
      console.log(err)
      return res.sendStatus(500)
    } else {
      res.status(200)
      res.json({})
      return res.end()
    }
  })
}

