import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

export const pool = new Pool({
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_DATABASE,
	password: process.env.DB_PASSWORD,
	port: Number(process.env.DB_PORT),
	ssl: process.env.NODE_ENV === "production"
})

pool.on('error', (err, client) => {
	console.error('Unexpected error on idle client: ', err)
	process.exit(-1)
})

// wrapper for pool.query to get some diagnostic data if needed
// more diagnostic ideas: https://node-postgres.com/guides/project-structure
export const Query = async (text: string, params: any[] | undefined = undefined) => {
	const start = Date.now()
	const res = await pool.query(text, params)
	const duration = Date.now() - start
	console.log('query execution time ', { text, params, duration, rows: res.rowCount })
	return res
}

