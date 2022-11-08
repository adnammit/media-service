# MEDIA SERVICE

RESTful API to support the Movie App with Express, Concurrently + Nodemon and PostgreSQL integration

## Local Quickstart
```sh
# install packages
npm install

# hot-load for development
npm run dev

# build for production -> /dist
npm run build
```
* [then try it out!](http://localhost:5555/api/v1/user)

## Notes
* dev hot-loading: Concurrently package is used to simultaneously watch and compile files on change and restart the server
* [dotenv package](https://medium.com/@thejasonfile/using-dotenv-package-to-create-environment-variables-33da4ac4ea8f) is required for node apps to read `.env` variables
* REST arch:
	- [Name Your Endpoints](https://restfulapi.net/resource-naming/)
	- [HTTP Response Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/100)
* [setting up diagnostics for database execution](https://node-postgres.com/guides/project-structure)

## To-do
* absolute paths in express is different...
* add exception handling and return meaningful json errors
* wire up each proc to and endpoint and test
* add auth
* write a postman collection
* check stuff out:
	- [Best Practices for Node.js Development](https://devcenter.heroku.com/articles/node-best-practices)
	- [Using WebSockets on Heroku with Node.js](https://devcenter.heroku.com/articles/node-websockets)
	- [Remember how psql do](https://www.tutorialspoint.com/postgresql/postgresql_insert_query.htm)


