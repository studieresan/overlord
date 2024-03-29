# Overlord

The one and only backend.

Start MongoDB

`mongod`

Install dependencies

`yarn install`

Create local .env:

`cp .env.example .env`

Start the server

`yarn start`

## API
The api documentation can be found in [API.md](API.md)

> The API was generated with [graphql-markdown](https://github.com/exogen/graphql-markdown) by running the server locally and running `graphql-markdown http://localhost:5040/graphql > API.md`

## Database
A generated documentation for the database schema can be found in the [database](database) directory, with a [JSON fil](database/schema.json) file and a [html diagram](database/schema.html) describing the relation. These are generated from the database and are not written by anyone in Studs, so there may be some variations

> These are generated with [extract-mongo-schema](https://www.npmjs.com/package/extract-mongo-schema) using `extract-mongo-schema -d CONNECTION-STRING -o schema.json -f json` and `extract-mongo-schema -d CONNECTION-STRING -o schema.html -f html-diagram`, where `CONNECTION-STRING` is the connection string to the database, with username and password 

## Testing
The server is tested using [jest](https://jestjs.io/) and the tests can be run with: `yarn test`.

Running the tests will generate a coverage-report which can be found in a new folder `coverage/` in the project-root. This folder will contain an `index.html` which you should open in your favourite browser of choice.

## Create account

To create an account in the database, either have a member of Studs create one for you on the website (project leader or IT bossman) or create a new document in the user collection with similar content as other users (copy-paste) and set the password do something arbitrary. Then on studs.se, press "forgot password" to reset the password and voíla! You can also add permissions for yourself in the document directly.

---

N.B. If you encounter the error `NonExistentPath: Data directory /data/db not found` when running `mongod`, run

`sudo mkdir -p /data/db`

and then

``sudo chown -R `whoami` /data/db``

Or, if you're running docker because you feel that it's gross to let a Mongo
server run loose on you're computer you can just run:

```
docker run --name studs-mongodb --detach --publish 127.0.0.1:27017:27017 mongo
```

This way your mongo server will only be available to `localhost` (127.0.0.1
instead of 0.0.0.0) and you won't have the above problem.

## Deployment
All merged pull request are automatically deployed to our staging environment
on Heroku (https://studs-overlord-stage.herokuapp.com/). When all testing has
been done in the stage environment and you are confident that everything works
as it should you simply promote the staging app to production.
