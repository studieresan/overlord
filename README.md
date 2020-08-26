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

## Create local account

Right now we're not making any difference in the account creation process from
running locally or in production. Therefore; after you've created a user below
you will receive an email requesting you to choose your password.

You will therefore need a SendGrid API key before proceeding.

So:

1. Ask the Head of IT to provide you with the SendGrid API key.

2. Create a studs member account through `curl`. Be sure to specify the correct
email address.

```
curl -H "Content-Type: application/json" -X POST -d '{"email":"<your-email-here>","firstName":"<your-firstname>","lastName":"<your-lastname>","user_role":"project_manager","token":"asdf"}' http://localhost:5040/signup
```

3. Open the email you received and proceed with setting your password to what
you want it to be.

---

N.B. If you encounter the error `NonExistentPath: Data directory /data/db not found` when running `mongod`, run

`sudo mkdir -p /data/db`

and then

``sudo chown -R `whoami` /data/db``

Or, if you're running docker because you feel that it's gross to let a Mongo
server run loose on you're computer you can just run

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
