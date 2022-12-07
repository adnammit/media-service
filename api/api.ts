import express, { Express } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import router from '../router/router'

const api: Express = express()

api.use(bodyParser.json())
	.use(bodyParser.urlencoded({ extended: true }))
	.use(cors())
	.use('/', router)

export default api