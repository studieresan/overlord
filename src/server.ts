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
import expressValidator = require('express-validator')
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString
} from 'graphql'

import * as graphqlHTTP from 'express-graphql'


const MongoStore = mongo(session)

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.config({ path: '.env.example' })


// TODO remove placeholder
let state = 'something'

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      state: {
        type: GraphQLString,
        resolve() {
          return state
        }
      },
      open: {
        type: GraphQLString,
        resolve() {
          return 'Hello everyone!'
        }
      },
      secret: {
        type: GraphQLString,
        resolve(a, b, { req }) {
          console.log(req)
          console.log(req.user)
          console.log(req.user.isAuthenticated)
          return req.user && req.user.isAuthenticated
            ? 'Hello secret!'
            : 'You are not good enough to see this'
        }
      }
    }
  }),
  mutation: new GraphQLObjectType({
    name: 'RootMutationType',
    fields: {
      setState: {
        type: GraphQLString,
        args: {
          newState: { type: GraphQLString }
        },
        resolve(value, { newState }) {
          state = newState
          return state
        }
      }
    }
  })
})

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
// mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI)

mongoose.connection.on('error', () => {
  console.log('MongoDB connection error. Please make sure MongoDB is running.')
  process.exit()
})

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
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
app.use(expressValidator())
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({
    url: process.env.MONGODB_URI || process.env.MONGOLAB_URI,
    autoReconnect: true
  })
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
app.post('/signup', userController.postSignup)
app.post('/account/password', passportConfig.isAuthenticated, userController.postUpdatePassword)

/**
 * Error Handler. Provides full stack - remove for production
 */
app.use(errorHandler())

app.use('/graphql', (req, res) =>
  graphqlHTTP({
     schema: schema,
     context: { req: req },
     graphiql: true,
  })(req, res)
)

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log(('  App is running at http://localhost:%d in %s mode'), app.get('port'), app.get('env'))
  console.log('  Press CTRL-C to stop\n')
})

module.exports = app
