/**
 * Module dependencies.
 */
import * as express from 'express'
import * as compression from 'compression'  // compresses requests
import * as session from 'express-session'
import * as bodyParser from 'body-parser'
import * as logger from 'morgan'
import * as errorHandler from 'errorhandler'
import * as lusca from 'lusca'
import * as dotenv from 'dotenv'
import * as mongo from 'connect-mongo'
import * as mongoose from 'mongoose'
import * as passport from 'passport'
import * as graphqlHTTP from 'express-graphql'

import expressValidator = require('express-validator')

import graphQLSchema from './graphql/schema'

const MongoStore = mongo(session)

/**
 * Load environment variables from .env file, where API
 * keys and passwords are configured.
 */
dotenv.config()

/**
 * Controllers (route handlers).
 */
import * as userController from './controllers/user'

/**
 * API keys and Passport configuration.
 */
import * as passportConfig from './config/passport'

/**
 * Create Express server.
 */
const app = express()

/**
 * Connect to MongoDB.
 */
const options = {
  promiseLibrary: global.Promise,
  useMongoClient: true,
}

mongoose.connect(process.env.MONGODB_URI, options)

mongoose.connection.on('error', () => {
  console.log('MongoDB connection error. Please make sure MongoDB is running.')
  process.exit()
})

app.use(function(req, res, next) {
  const allowedOrigins = [
    process.env.FRONTEND_ORIGIN || 'http://localhost:3000',
    process.env.HEROKU_ORIGIN || 'http://localhost:3000',
  ]
  const origin = allowedOrigins.find(origin => origin == req.headers.origin)
  if (origin) {
    res.header('Access-Control-Allow-Origin', origin)
    res.header('Access-Control-Allow-Credentials', 'true')
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    )
  }
  // Allow preflight
  if (req.method === 'OPTIONS')
    return res.end()
  next()
})

/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 5040)
app.use(compression())
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.text({ type: 'application/graphql' }))
app.use(expressValidator())
app.use(session({
  resave: false,
  saveUninitialized: false,
  cookie : {
    maxAge: 24 * 60 * 60 * 1000 * 14, // two weeks
  },
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({
    url: process.env.MONGODB_URI,
    autoReconnect: true,
  }),
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(lusca.xframe('SAMEORIGIN'))
app.use(lusca.xssProtection(true))
app.use((req, res, next) => {
  res.locals.user = req.user
  next()
})
app.use((req, res, next) => {
  // After successful login, redirect back to the intended page
  if (!req.user &&
      req.path !== '/login' &&
      req.path !== '/signup' &&
      !req.path.match(/^\/auth/) &&
      !req.path.match(/\./)) {
    req.session!.returnTo = req.path
  } else if (req.user &&
      req.path == '/account') {
    req.session!.returnTo = req.path
  }
  next()
})

/**
 * Primary app routes.
 */
app.post('/login', userController.postLogin)
app.get('/logout', userController.logout)
app.post('/forgot', userController.postForgot)
app.post('/reset/:token', userController.postReset)
app.post('/signup', (req, res, next) => {
  if (process.env.SIGNUP_TOKEN && req.body.token === process.env.SIGNUP_TOKEN) {
    return userController.postSignup(req, res, next)
  } else {
    res.status(403)
    res.end()
  }
})

app.post(
  '/account/password',
  passportConfig.isAuthenticated,
  userController.postUpdatePassword
)

/**
 * Error Handler. Provides full stack - remove for production
 */
app.use(errorHandler())

app.use('/graphql', (req, res) =>
  graphqlHTTP({
     schema: graphQLSchema,
     context: { req: req },
     graphiql: true,
  })(req, res)
)

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log(
    ('  App is running at http://localhost:%d in %s mode'),
    app.get('port'),
    app.get('env')
  )
  console.log('  Press CTRL-C to stop\n')
})

module.exports = app
