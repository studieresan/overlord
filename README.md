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

With curl:

`curl -H "Content-Type: application/json" -X POST -d '{"email":"some@email.com","password":"asdf","confirmPassword":"asdf","firstName":"Alex","lastName":"DeLarge","memberType":"studs_member","token":"asdf"}' http://localhost:5040/signup`

With httpie:

`http POST localhost:5040/signup email=some@email.com password=asdf confirmPassword=asdf firstName=Alex lastName=DeLarge memberType=studs_member token=asdf`

---

N.B. If you encounter the error `NonExistentPath: Data directory /data/db not found` when running `mongod`, run

`sudo mkdir -p /data/db`

and then

``sudo chown -R `whoami` /data/db``
