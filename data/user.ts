import { Request, Response, NextFunction } from 'express'
import { TypedRequestBodyParam, TypedRequestQuery } from '../models/requestTypes'
import { QueryResult, ResponseCode } from '../models/queryResult'
import UtilFuncs from '../helpers/utils'
import { Query } from './pool'

export class User {

	private readonly userFields = `
		userid,
		username,
		email,
		firstname,
		lastname,
		active
	`

	public getUsers = async (req: TypedRequestQuery<{ id: string, username: string, email: string }>, res: Response, next: NextFunction) => {

		const { id, username, email } = req.query

		if (!!id && !UtilFuncs.StringIsInt(id)) {
			res.status(ResponseCode.BadRequest).json({ error: 'invalid userid' })
			return
		}

		const sql = `select ${this.userFields} from public.getUser(_username => $1, _userid => $2, _email => $3)`
		const params: (string | null)[] = [
			username ?? null,
			id ?? null,
			email ?? null,
		]

		const result = await Query(sql, params)
			.then((results) => {
				const code = results.rows.length == 0 ? ResponseCode.NotFound : ResponseCode.OK
				const data = code == ResponseCode.OK ? results.rows : []
				return new QueryResult({ code: code, result: data })
			})

		res.status(result.code).json(result.toResponseObj())
	}

	public addUser = async (req: Request, res: Response, next: NextFunction) => {

		const { username, email, firstname, lastname } = req.body

		if (!username || !email || !firstname || !lastname) {
			res.status(ResponseCode.BadRequest).json({ error: 'invalid user data' })
			return
		}

		const sql = `
			select ${this.userFields} from public.addUser(
				_username => $1,
				_email => $2,
				_firstname => $3,
				_lastname => $4)
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

			await Query(sql, [username, email, firstname, lastname])
				.then((results) => {
					const result = new QueryResult({ code: ResponseCode.Created, result: results.rows[0] })
					res.status(result.code).json(result.toResponseObj())
				})
		}
	}

	public updateUser = async (req: TypedRequestBodyParam<{ id: string }, { firstname?: string, lastname?: string, active?: boolean }>, res: Response, next: NextFunction) => {

		const id = req.params.id

		if (!UtilFuncs.StringIsInt(id)) {
			res.status(ResponseCode.BadRequest).json({ error: 'invalid userid' })
			return
		}

		const { firstname, lastname, active } = req.body
		const sql = `
			select ${this.userFields} from public.updateUser(
				_userid => $1,
				_firstname => $2,
				_lastname => $3,
				_active => $4)
			`

		const params: (string | null)[] = [
			id,
			firstname ?? null,
			lastname ?? null,
			active === null ? null : String(active),
		]

		await Query(sql, params)
			.then((results) => {
				const code = results.rows.length == 0 ? ResponseCode.NotFound : ResponseCode.OK
				const result = new QueryResult({ code: code, result: results.rows[0] })
				res.status(result.code).json(result.toResponseObj())
			})
	}

	private getUser = async (identifier: string, params: string): Promise<QueryResult> => {
		const sql = `select ${this.userFields} from public.getUser(${identifier} => $1)`

		return Query(sql, [params])
			.then((results) => {
				const code = results.rows.length == 0 ? ResponseCode.NotFound : ResponseCode.OK
				const data = code == ResponseCode.OK ? results.rows[0] : null
				return new QueryResult({ code: code, result: data })
			})
	}
}

export default new User()