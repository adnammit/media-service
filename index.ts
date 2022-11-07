import express, { Express } from 'express'
import bodyParser from 'body-parser'
import router from './router/router'
import api from './api/api'
import dotenv from 'dotenv'

dotenv.config()

const app: Express = express()
const port = process.env.APP_PORT

app.use(bodyParser.json())
	.use(bodyParser.urlencoded({ extended: true }))
	// .use(cors())
	.use('/user', router)

app.use('/api/v1', api)
	// .use(exceptionHandler.log)
	// .use(exceptionHandler.clientHandle)
	// .use(exceptionHandler.handle)

app.listen(port, () => {
	console.log(`⚡️[server]: Server is running at https://localhost:${port}`)
})
