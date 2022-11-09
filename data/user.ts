import { Request, Response, NextFunction } from 'express'
import { TypedRequestQuery } from '../models/requestTypes'
import { QueryResult, ResponseCode } from '../models/queryResult'
import { query } from './pool'

export class User {

	public getUsers = async (req: TypedRequestQuery<{ id: string, username: string }>, res: Response, next: NextFunction) => {

		const id = req.query.id
		const username = req.query.username
		let result: QueryResult

		if (!!id) {

			result = await this.getUser('_userid', id)
			res.status(result.code).json(result.toResponseObj())

		} else if (!!username) {

			result = await this.getUser('_username', username)
			res.status(result.code).json(result.toResponseObj())

		} else {

			const sql = 'SELECT * FROM public.user'

			result = await query(sql)
				.then((results) => {
					return new QueryResult({ code: ResponseCode.OK, result: results.rows })
				})
		}

		res.status(result.code).json(result.toResponseObj())
	}

	public getUserById = async (req: TypedRequestQuery<{ id: string }>, res: Response, next: NextFunction) => {
		const id = req.query.id
		const result = await this.getUser('_userid', id)
		res.status(result.code).json(result.toResponseObj())
	}

	public getUserByUsername = async (req: TypedRequestQuery<{ username: string }>, res: Response, next: NextFunction) => {
		const username = req.query.username
		const result = await this.getUser('_username', username)
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

		const existingUser = await this.getUser('_username', username)

		if (!!existingUser.result) {
			const result = new QueryResult({ code: ResponseCode.Conflict, error: 'username already exists' })
			res.status(result.code).json(result.toResponseObj())

		} else {

			await query(sql, [username, email, firstname, lastname])
				.then((results) => {
					const userid = results.rows[0]?.userid
					const result = new QueryResult({ code: ResponseCode.Created, result: { userid: userid } })
					res.status(result.code).json(result.toResponseObj())
				})
				.catch((err) => {
					console.error(err)
					next(err)
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
			.catch((err) => {
				console.error(err)
				return new QueryResult({ code: ResponseCode.Error, error: err.message })
			})
	}
}

export default new User()