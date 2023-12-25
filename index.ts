import express, { Express } from 'express'
import api from './api/api'
import dotenv from 'dotenv'
import { log, clientHandle, handle } from './middleware/exception-handler'

dotenv.config()

const app: Express = express()
const port = process.env.PORT || 5555

app.use('/api/v1', api)
	.use(log)
	.use(clientHandle)
	.use(handle)

app.listen(port, () => {
	if (process.env.NODE_ENV !== 'production') {
		console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
	}
})
