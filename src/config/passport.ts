import * as passport from 'passport'
import * as passportLocal from 'passport-local'
import * as passportJWT from 'passport-jwt'

import { User } from '../mongodb/User'
import { Request, Response, NextFunction } from 'express'

const LocalStrategy = passportLocal.Strategy
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

passport.serializeUser<any, any>((user, done) => {
  done(undefined, user.id)
})

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user!)
  })
})

/**
 * Sign in using Email and Password.
 */
passport.use(
  new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
  User.findOne({ email: email.toLowerCase() }, (err, user: any) => {
    if (err) { return done(err) }
    if (!user) {
      return done(undefined, false, { message: `Email ${email} not found.` })
    }
    user.comparePassword(password, (err: Error, isMatch: boolean) => {
      if (err) { return done(err) }
      if (isMatch) {
        return done(undefined, user)
      }
      return done(undefined, false, { message: 'Invalid email or password.' })
    })
  })
}))

/**
 * Authenticate using JSON Web Tokens.
 */
passport.use(new JWTStrategy({
    jwtFromRequest : ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey : process.env.JWT_SECRET,
  },
  (jwtPayload, done) => {
    User.findOne({ email: jwtPayload }, (err, user: any) => {
      if (err) { return done(err) }
      if (!user) {
        return done(
          undefined,
          false,
          { message: 'Provided user not found.' }
        )
      }
      return done(undefined, user)
    })
  }
))

/**
 * OAuth Strategy Overview
 *
 * - User is already logged in.
 *   - Check if there is an existing account with a provider id.
 *     - If there is, return an error message. (Account merging not supported)
 *     - Else link new OAuth account with currently logged-in user.
 * - User is not logged in.
 *   - Check if it's a returning user.
 *     - If returning user, sign in and we are done.
 *     - Else check if there is an existing account with user's email.
 *       - If there is, return an error message.
 *       - Else create a new account.
 */

/**
 * Login Required middleware.
 */
export let isAuthenticated = passport.authenticate('jwt', { session: false })

/**
 * Authorization Required middleware.
 */
export let isAuthorized = (req: Request, res: Response, next: NextFunction) => {
  const provider = req.path.split('/').slice(-1)[0]
  if (req.user.tokens.find((t: any) => t.kind === provider)) {
    next()
  } else {
    res.redirect(`/auth/${provider}`)
  }
}
