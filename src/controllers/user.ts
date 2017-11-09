import * as async from 'async'
import * as nodemailer from 'nodemailer'
import * as passport from 'passport'
import { default as User, UserModel } from '../mongodb/User'
import { MemberType } from '../models'
import { Request, Response, NextFunction } from 'express'
import { LocalStrategyInfo } from 'passport-local'
import { WriteError } from 'mongodb'

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
    // req.flash('errors', errors)
    console.log('errors')
    console.log(errors)
    console.log(req.body)
    return res.redirect('/login')
  }

  passport.authenticate( 'local',
    (err: Error, user: any, info: LocalStrategyInfo) => {
    if (err) { return next(err) }
    if (!user) {
      // req.flash('errors', info.message)
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
  req.logout()
  res.redirect('/')
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
      // req.flash(
      //   'errors',
      //   { msg: 'Account with that email address already exists.'
      // })
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
export let postUpdatePassword =
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
      // req.flash('errors', errors)
      return res.redirect('/account')
    }

    User.findById(req.user.id, (err, user: UserModel) => {
      if (err) { return next(err) }
      user.password = req.body.password
      user.save((err: WriteError) => {
        if (err) { return next(err) }
        // req.flash('success', { msg: 'Password has been changed.' })
        res.redirect('/account')
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
    // req.flash('errors', errors)
    return res.redirect('back')
  }

  async.waterfall([
    function resetPassword(done: Function) {
      User
        .findOne({ passwordResetToken: req.params.token })
        .where('passwordResetExpires').gt(Date.now())
        .exec((err, user: any) => {
          if (err) { return next(err) }
          if (!user) {
            // req.flash(
            //   'errors',
            //   { msg: 'Password reset token is invalid or has expired.'
            // })
            return res.redirect('back')
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
      const transporter = nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USER,
          pass: process.env.SENDGRID_PASSWORD,
        },
      })
      const mailOptions = {
        to: user.email,
        from: 'express-ts@starter.com',
        subject: 'Your password has been changed',
        text: `Hello,
        \n\nThis is a confirmation that the password for your
        account ${user.email} has just been changed.\n`,
      }
      transporter.sendMail(mailOptions, (err) => {
        // req.flash(
        //   'success',
        //   { msg: 'Success! Your password has been changed.'
        // })
        done(err)
      })
    },
  ], (err) => {
    if (err) { return next(err) }
    res.redirect('/')
  })
}

/**
 * POST /forgot
 * Create a random token, then the send user an email with a reset link.
 */
/* TODO
export let postForgot = (req: Request, res: Response, next: NextFunction) => {
  req.assert('email', 'Please enter a valid email address.').isEmail()
  req.sanitize('email').normalizeEmail({ gmail_remove_dots: false })

  const errors = req.validationErrors()

  if (errors) {
    // req.flash('errors', errors)
    return res.redirect('/forgot')
  }

  async.waterfall([
    function createRandomToken(done: Function) {
      crypto.randomBytes(16, (err, buf) => {
        const token = buf.toString('hex')
        done(err, token)
      })
    },
    function setRandomToken(token: AuthToken, done: Function) {
      User.findOne({ email: req.body.email }, (err, user: any) => {
        if (err) { return done(err) }
        if (!user) {
          // req.flash(
          //   'errors',
          //   { msg: 'Account with that email address does not exist.'
          // })
          return res.redirect('/forgot')
        }
        user.passwordResetToken = token
        user.passwordResetExpires = Date.now() + 3600000 // 1 hour
        user.save((err: WriteError) => {
          done(err, token, user)
        })
      })
    },
    function sendForgotPasswordEmail(
      token: AuthToken, user: UserModel, done: Function) {
      const transporter = nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USER,
          pass: process.env.SENDGRID_PASSWORD,
        },
      })
      const mailOptions = {
        to: user.email,
        from: 'hackathon@starter.com', // TODO change to something reasonable
        subject: 'Reset your password on Hackathon Starter',
        text:
        `You are receiving this email because you (or someone else) has
        requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser
        to complete the process:\n\n
          http://${req.headers.host}/reset/${token}\n\n
          If you did not request this, please ignore this email and your
          password will remain unchanged.\n`,
      }
      transporter.sendMail(mailOptions, (err) => {
        // req.flash(
        //   'info',
        //   { msg: `An e-mail has been
        //   sent to ${user.email} with further instructions.`
        // })
        done(err)
      })
    },
  ], (err) => {
    if (err) { return next(err) }
    res.redirect('/forgot')
  })
}
*/
