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
// app.use((err: any, req: any, res: any, next: any) => {
// 	console.error('something broke!')
// 	console.error(err)

// 	res.status(500)
// 	res.render('error', { error: err })
// 	// if (req.xhr) {
// 	// 	res.status(500).send({ error: 'Something failed!' })
// 	// } else {
// 	// 	next(err)
// 	// }
// })

app.use((err: any, req: any, res: any, next: any) => {
	console.error('Error encountered')
	console.error('Path: ', req.path)
	console.error(err)
	next() // (optional) invoking next middleware
})

app.listen(port, () => {
	if (process.env.NODE_ENV !== 'production') {
		console.log(`⚡️[server]: Server is running at https://localhost:${port}`)
	}
})


