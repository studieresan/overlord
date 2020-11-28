import * as passport from 'passport'
import * as passportLocal from 'passport-local'
import * as passportJWT from 'passport-jwt'

import { User } from '../mongodb/User'
import { Request, Response, NextFunction } from 'express'
import { UserActionsImpl } from '../controllers'

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
    new UserActionsImpl().getUserOfEmail(jwtPayload).then(user => {
      console.log('JWT USER: ', user)
      req.user = user
      console.log("Req user", user)
      return done(undefined, user)
    })
  })
)

export let authenticate = passport.authenticate('jwt', { session: false })

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
