import { Request, Response, NextFunction } from 'express'
import { TypedRequestQuery } from '../models/requestTypes'
import { QueryResult, ResponseCode } from '../models/queryResult'
import { query } from './pool'

export class User {

	public getUsers = async (req: TypedRequestQuery<{ id: string, username: string, email: string }>, res: Response, next: NextFunction) => {

		const id = req.query.id
		const username = req.query.username
		const email = req.query.email

		const sql = `select * from public.getUser(_username => $1, _userid => $2, _email => $3)`
		const params: (string | null)[] = [
			username ?? null,
			id ?? null,
			email ?? null,
		]

		const result = await query(sql, params)
			.then((results) => {
				const code = results.rows.length == 0 ? ResponseCode.NotFound : ResponseCode.OK
				const user = code == ResponseCode.OK ? results.rows : null
				return new QueryResult({ code: code, result: user })
			})

		res.status(result.code).json(result.toResponseObj())
	}

	public addUser = async (req: Request, res: Response, next: NextFunction) => {
		const { username, email, firstname, lastname } = req.body
		const sql = `
			select public.addUser(
				_username => $1,
				_email => $2,
				_firstname => $3,
				_lastname => $4) as userid
			`

		const existingUsername = await this.getUser('_username', username)
		const existingEmail = await this.getUser('_email', email)

		if (!!existingUsername.result || !!existingEmail.result) {
			let message = `User already exists with `
			message += `${!!existingUsername.result && !!existingEmail.result
				? 'username and email'
				: !!existingUsername.result
				? 'username'
				: 'email'}`
			const result = new QueryResult({ code: ResponseCode.Conflict, error: message })
			res.status(result.code).json(result.toResponseObj())

		} else {

			await query(sql, [username, email, firstname, lastname])
				.then((results) => {
					const userid = results.rows[0]?.userid
					const result = new QueryResult({ code: ResponseCode.Created, result: { userid: userid } })
					res.status(result.code).json(result.toResponseObj())
				})
		}
	}

	private getUser = async (identifier: string, params: string): Promise<QueryResult> => {
		const sql = `select * from public.getUser(${identifier} => $1)`

		return query(sql, [params])
			.then((results) => {
				const code = results.rows.length == 0 ? ResponseCode.NotFound : ResponseCode.OK
				const user = code == ResponseCode.OK ? results.rows[0] : null
				return new QueryResult({ code: code, result: user })
			})
	}
}

export default new User()