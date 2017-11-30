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


## Create local account

Create user (using httpie):

`http POST localhost:5040/signup email=some@email.com firstName=Alex lastName=DeLarge memberType=studs_member password=asdf confirmPassword=asdf token=asdf`

