import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const pool = new Pool({
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_DATABASE,
	password: process.env.DB_PASSWORD,
	port: Number(process.env.DB_PORT)
	// sslmode: process.env.NODE_ENV === "production" ? "require" : "disable" // need this?
})

pool.on('error', (err, client) => {
	console.error('Error:', err);
});

export default pool