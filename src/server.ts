import * as dotenv from 'dotenv'
import * as Sentry from '@sentry/node'
/**
 * Load environment variables from .env file, where API
 * keys and passwords are configured.
 */
dotenv.config()

import * as express from 'express'
import * as compression from 'compression'  // compresses requests
import * as bodyParser from 'body-parser'
import * as logger from 'morgan'
import * as errorHandler from 'errorhandler'
import * as lusca from 'lusca'
import * as mongoose from 'mongoose'
import * as passport from 'passport'
import * as cors from 'cors'
import { graphqlHTTP } from 'express-graphql'
import { signedUploadRequest } from './imageUpload'
import { getPDF } from './aws/pdfDownload'

import expressValidator = require('express-validator')

import graphQLSchema from './graphql/schema'

/**
 * Controllers (route handlers).
 */
import * as userController from './controllers/user'

/**
 * API keys and Passport configuration.
 */
import * as passportConfig from './config/passport'

function setCacheControl(req, res, next) {
  res.setHeader('Cache-Control', 'public, max-age=86400')
  next();
}

/**
 * Create Express server.
 */
const app = express()

/**
 * Activate Sentry
 */
Sentry.init({
  dsn: process.env.SENTRY_DSN,
})

/**
 * Connect to MongoDB.
 */
const options = {
  promiseLibrary: global.Promise,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
}

if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGODB_URI!, options)
    .catch((e) => console.log(e))

  mongoose.connection.on('error', () => {
    console.log('MongoDB connection error. Please make sure MongoDB is running.')
    process.exit()
  })
}
app.use(function (req, res, next) {
  console.log('origin: ', req.get('Origin'));
  console.log('process.env.FRONTEND_ORIGIN: ', process.env.FRONTEND_ORIGIN);
  console.log('process.env.FRONTEND_ALIAS: ', process.env.FRONTEND_ALIAS);
  console.log('process.env.HEROKU_ORIGIN: ', process.env.HEROKU_ORIGIN);
  console.log('process.env.STAGE_ORIGIN: ', process.env.STAGE_ORIGIN);

  const allowedOrigins = [
    process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
    process.env.FRONTEND_ALIAS || 'http://localhost:5173',
    process.env.HEROKU_ORIGIN || 'http://localhost:5173',
    process.env.STAGE_ORIGIN || 'http://localhost:5173',
  ]
  const netlifypreview = /https:\/\/[0-9a-z-]+--studs.netlify.app/g
  const origin = req.get('Origin')
  const foundOrigin = allowedOrigins.find(o => o == origin)
  if (foundOrigin) {
    res.header('Access-Control-Allow-Origin', foundOrigin)
    res.header('Access-Control-Allow-Credentials', 'true')
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    )
    res.header('Access-Control-Allow-Methods', 'POST, PUT, GET, OPTIONS'
    )
  }
  else if (origin?.match(netlifypreview)) {
    res.header('Access-Control-Allow-Origin', origin)
    res.header('Access-Control-Allow-Credentials', 'true')
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    )
  }
  // Allow preflight
  if (req.method === 'OPTIONS') {
    return res.end()
  }

  next()
})

function logRequest(req, res, next) {
  console.log(`[${new Date().toISOString()}] Request: ${req.method} ${req.url} from ${req.headers.origin}`);
  next();
}
app.use(logRequest); // Add this line

app.get('/test', (req, res) => {
  res.send('Test endpoint');
});

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
app.use(passport.initialize())
app.use(lusca.xframe('SAMEORIGIN'))
app.use(lusca.xssProtection(true))
app.use((req, res, next) => {
  res.locals.user = req.user
  next()
})

/**
 * Primary app routes.
 */
app.post('/login', userController.postLogin)
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

app.put(
  '/account/password',
  passportConfig.authenticate,
  userController.putUpdatePassword
)

/**
 * Return a signed S3 url that a client will be able to
 * upload files to
 */
app.get('/signed-upload', signedUploadRequest)

/**
 * Error Handler. Provides full stack - remove for production
 */
app.use(errorHandler())

app.use('/graphql', setCacheControl, (req, res) =>
  graphqlHTTP({
    schema: graphQLSchema,
    context: { req: req, res: res },
    graphiql: process.env.DEV === 'true',
  })(req, res)
);

app.get('/brochure.pdf', getPDF)
app.get('/brochure_eng.pdf', getPDF)

/**
 * Start Express server.
 */
if (process.env.NODE_ENV !== 'test') {
  app.listen(app.get('port'), () => {
    console.log(
      ('  App is running at http://localhost:%d in %s mode'),
      app.get('port'),
      app.get('env')
    )
    console.log('  Press CTRL-C to stop\n')
  })
}

export { app }
