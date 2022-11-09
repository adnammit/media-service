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
* [then try it out!](http://localhost:5555/api/v1/users) [or check on prod](https://media-service.onrender.com/api/v1/users)

## Notes
* dev hot-loading: Concurrently package is used to simultaneously watch and compile files on change and restart the server
* [dotenv package](https://medium.com/@thejasonfile/using-dotenv-package-to-create-environment-variables-33da4ac4ea8f) is required for node apps to read `.env` variables
* REST arch:
	- [Name Your Endpoints](https://restfulapi.net/resource-naming/)
	- [HTTP Response Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/100)
* [setting up diagnostics for database execution](https://node-postgres.com/guides/project-structure)
* [Best Practices for Node.js Development](https://devcenter.heroku.com/articles/node-best-practices)
* [Typed requests](https://javascript.plainenglish.io/typed-express-request-and-response-with-typescript-7277aea028c)
* having to return `next(err)` for every route was a PITA, so i upgraded to beta Express5 which includes middleware that automatically calls `next` when errors are thrown -- [more info](https://expressjs.com/en/guide/error-handling.html)

## To-do
* absolute paths in express is different...
* add exception handling and return meaningful json errors
* wire up each proc to and endpoint and test
* add auth
* write a postman collection
* check out [express middlewares](https://blog.bitsrc.io/5-express-middleware-libraries-every-developer-should-know-94e2728f7503)
* upgrade to Express5 from beta when that comes out
* check [this](https://javascript.plainenglish.io/how-to-automatically-convert-typescript-types-to-runtime-validators-5b06ee269b13) out

