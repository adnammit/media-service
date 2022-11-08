import { stat } from 'fs'
import { Query } from 'pg'
import { query } from './pool'

export class User {

	public getUsers = async (req: any, res: any, next: any) => {
		const sql = 'SELECT * FROM public.user'

		await query(sql)
			.then((results) => {

				const result = new QueryResult({ status: QueryStatus.Success, result: results.rows })
				res.status(result.responseCode).json(result.toResponseObj())

				// res.status(200).json(results.rows)
			})
			.catch((err) => {
				next(err)
			})
	}

	public getUserById = async (req: any, res: any, next: any) => {
		const { id } = req.params
		const result = await this.getUser('_userid', id)

		res.status(result.responseCode).json(result.toResponseObj())


		// if (userResult.status == QueryStatus.Success) {
		// 	res.status(200).json(userResult.result)
		// } else if (userResult.status == QueryStatus.NotFound) {
		// 	res.status(404).json({ status: 'failure', message: 'User not found' })
		// } else {
		// 	res.status(500).json({ status: 'failure', message: userResult.message })
		// }
	}

	public getUserByUsername = async (req: any, res: any, next: any) => {
		const { username } = req.params
		const result = await this.getUser('_username', username)

		res.status(result.responseCode).json(result.toResponseObj())


		// if (userResult.status == QueryStatus.Success) {
		// 	res.status(200).json(userResult.result)
		// } else if (userResult.status == QueryStatus.NotFound) {
		// 	res.status(404).json({ status: 'failure', message: 'User not found' })
		// } else {
		// 	res.status(500).json({ status: 'failure', message: userResult.message })
		// }

		// const sql = `select * from public.getUser(_username => $1)`

		// await query(sql, [username])
		// 	.then((results) => {
		// 		if (results.rows.length == 0) {
		// 			res.status(404).json({ status: 'failure', message: 'User not found', username: username })
		// 		} else {
		// 			res.status(200).json(results.rows)
		// 		}
		// 	})
		// 	.catch((err) => {
		// 		next(err)
		// 	})
	}

	public addUser = async (req: any, res: any, next: any) => {
		const { username, email, firstname, lastname } = req.body
		const sql = `
			select public.addUser(
				_username => $1,
				_email => $2,
				_firstname => $3,
				_lastname => $4) as userid
			`

		const existingUser = await this.getUser('_username', username)

		if (existingUser.status == QueryStatus.Success) {

			res.status(ResponseCode.Conflict).json({ errorMessage: 'username already exists' })

		} else {

			await query(sql, [username, email, firstname, lastname])
				.then((results) => {
					const userid = results.rows[0]?.userid
					const result = new QueryResult({ status: QueryStatus.Created, result: { userid: userid } })
					res.status(result.responseCode).json(result.toResponseObj())
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
				const status = results.rows.length == 0 ? QueryStatus.NotFound : QueryStatus.Success
				const user = status == QueryStatus.Success ? results.rows[0] : null
				return new QueryResult({ status: status, result: user })
			})
			.catch((err) => {
				console.error(err)
				return new QueryResult({ status: QueryStatus.Failure, errorMessage: err.message })
				// return { status: QueryStatus.Failure, message: err.message }
			})
	}
}


enum QueryStatus {
	Success,
	Created,
	Failure,
	NotFound,
	Exists,
	InvalidRequest,
}

enum ResponseCode {
	OK = 200,
	Created = 201,
	Error = 500,
	NotFound = 404,
	Conflict = 409,
	BadRequest = 400,
}

interface IQueryResultParams {
	status: QueryStatus,
	errorMessage?: string,
	result?: any
}

class QueryResult {
	status: QueryStatus
	errorMessage?: string
	result?: any

	get responseCode(): number {
		return this.QueryResponseMap.get(this.status) as number
	}

	toResponseObj(): any {
		return {
			errorMessage: this.errorMessage,
			result: this.result
		}
	}

	private QueryResponseMap = new Map<QueryStatus, ResponseCode>([
		[QueryStatus.Success, ResponseCode.OK],
		[QueryStatus.Created, ResponseCode.Created],
		[QueryStatus.Failure, ResponseCode.Error],
		[QueryStatus.NotFound, ResponseCode.NotFound],
		[QueryStatus.Exists, ResponseCode.Conflict],
	])

	constructor(params: IQueryResultParams)
	{
		this.status = params.status
		this.errorMessage = params.errorMessage
		this.result = params.result
	}
}

export default new User()