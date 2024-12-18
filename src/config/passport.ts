import * as passport from 'passport'
import * as passportLocal from 'passport-local'
import * as passportJWT from 'passport-jwt'

import * as dotenv from 'dotenv';
dotenv.config();

import { User } from '../mongodb/User'
import { Request, Response, NextFunction } from 'express'

import { User as UserModel } from '../models'

const LocalStrategy = passportLocal.Strategy
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

passport.serializeUser<any, any>((user, done) => {
  done(undefined, user['id'])
})

passport.deserializeUser((id, done) => {
  User.findById(<any>id, (err, user) => {
    done(err, user!)
  })
})

/**
 * Sign in using Email and Password.
 */
passport.use(
  new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
  console.log("\n Running USE \n")
  User.findOne({ 'info.email': email.toLowerCase() }, (err, user: any) => {
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
    passReqToCallback: true,
  },
  (req: any, jwtPayload: any, done: any) => {
    console.log("\n Use JWT strat \n")
    User.findOne({ 'info.email': jwtPayload }, (err, user: any) => {
      if (err) {
        return done(err)
      }
      if (!user) {
        return done(
          undefined,
          false,
          { message: 'Provided user not found.' }
        )
      }
      req.user = user
      return done(undefined, user)
    })
  }
))

export let authenticate = (req: Request, res: Response, next: NextFunction) => {
    console.log("\n Running authenticate \n")
    passport.authenticate('jwt', { session: false })(req, res, next)
  }

/**
 * Authorization Required middleware.
 */
export let isAuthorized = (req: Request, res: Response, next: NextFunction) => {
  const provider = req.path.split('/').slice(-1)[0]
  console.log("\n Running Middleware\n")
  if ((req?.user as UserModel)?.tokens.find((t: any) => t.kind === provider)) {
    next()
  } else {
    res.redirect(`/auth/${provider}`)
  }
}
