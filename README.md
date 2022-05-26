# sommelier
Quick and Dirty back-end project to check our understanding of back-end workflow. Everything done on NodeJS with remote MondoDB database.

## Usage
```.env``` file has to be created in root directory
```
PORT=<choose a port>
JWT_SECRET_KEY=<Generated JWT key>
JWT_REFRESH_TOKEN_SECRET=<Generate Different JWT key>
TOKEN_HEADER_KEY=<JWT Header key>
DB_USERNAME=<MongoDB database user Name>
DB_PASSWORD=<MongoDB database user password>
DB_CLUSTER=<MongoDB cluster name>
DB_DBNAME=<MongoDB Database name>
```
Initialize and start project:
```
npm init
npm start
```

This project contains ```.rest``` files in its directory, they can be used with VSCode extension "REST Client", It's a simpler way to send requests to the server without opening third party programmes.

### user_request.rest contains:
- ```GET /welcome```, used to check if JWT token works
- ```POST /token```, compares provided refresh token with one stored in the database and generates a new JWT access token. Refresh Token has 7day expiration date.
- ```POST /register```, Registers a new user. Username, email and password are required, Registration date gets generated automatically.
- ```POST /login```, Log in for user. Uses Username and Password to authenticate. Alsto stores a new Refresh token in the database. 
- ```DELETE /logout```, Removes Refresh token from server, so that after expiration, new tokens will not be generated until user logs in again.
- ```POST /change-password```, takes old-password and new-password, and if logic is correct, changes users password.

### wine_request.rest contains:
- ```GET /wines```, return full list of wines stored in database.
- ```GET /wines/:page```, return list with paggination, currently set to return 5 items per page, starting at 0.
- ```POST /wines```, Lets authenticated users post new wines.

### collection_request.rest contains:
- ```GET /my-wines```, Authorizes user and returns his wine list.
- ```POST /my-wines```, Adds a selected wine to array using wine_id and quantity, if wine is a duplicate it updates only the quantity.

note: ```.rest``` request *Authorization* header refers to JWT access token, while "token" in body is used as a refrest token 
