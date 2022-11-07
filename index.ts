import express, { Express } from 'express'
import api from './api/api'
import dotenv from 'dotenv'

dotenv.config()

const app: Express = express()
const port = process.env.PORT || 5555

app.use('/api/v1', api)
// .use(exceptionHandler.log)
// .use(exceptionHandler.clientHandle)
// .use(exceptionHandler.handle)

app.listen(port, () => {
	if (process.env.NODE_ENV !== 'production') {
		console.log(`⚡️[server]: Server is running at https://localhost:${port}`)
	}
})


