import { Pool } from 'pg'

// const isProduction = process.env.NODE_ENV === 'production'

// const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`

// export default new Pool({
// 	connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
// })

export default new Pool({
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_DATABASE,
	password: process.env.DB_PASSWORD,
	port: Number(process.env.DB_PORT)
	// sslmode: process.env.NODE_ENV === "production" ? "require" : "disable" // need this?
})

// pool.on('error', (err, client) => {
// 	console.error('Error:', err);
// });

// pool.connect()


// module.exports = { pool }