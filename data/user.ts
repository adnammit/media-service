import pool from './pool'

export class User {

	public getUsers = (request: any, response: any, next: any) => {
		pool.query('SELECT * FROM public.user',)
			.then((results) => {
				response.status(200).json(results.rows)
			})
			.catch((err) => {
				next(err)
			})
	}
}
// these user endpoints are untested

// const getUserByUserId = (request, response, next) => {
// 	const id = parseInt(request.params.id)
// 	pool.query('SELECT * FROM public.user WHERE id = $1 LIMIT 1', [id])
// 		.then((results) => {
// 			response.status(200).json(results.rows.length > 0 ? results.rows[0] : null)
// 		})
// 		.catch((err) => {
// 			next(err)
// 		})
// }

// const getUserByUsername = (request, response, next) => {
// 	pool.query('SELECT * FROM public.user WHERE username = $1 LIMIT 1', [request.username])
// 		.then((results) => {
// 			response.status(200).json(results.rows.length > 0 ? results.rows[0] : null)
// 		})
// 		.catch((err) => {
// 			next(err)
// 		})
// }

// const addUser = (request, response, next) => {
// 	const { username, email, firstname, lastname } = request.body
// 	pool.query(
// 		'select public.addUser($1, $2, $3, $4)',
// 		[username, email, firstname, lastname])
// 		.then((results) => {
// 			response.status(201).json({ status: 'success', message: 'User added.' })
// 		})
// 		.catch((err) => {
// 			next(err)
// 		})
// }

export default new User()