import { Response, NextFunction } from 'express'
import { ResponseCode } from '../models/response-code'
import { TypedRequestBodyParam, TypedRequestParam } from '../models/typed-request'
import { QueryResult } from '../models/query-result'
import { AddTitleQuery, ITitleInput } from '../models/title'
import UtilFuncs from '../helpers/utils'
import { Query } from './pool'

export class UserTitle {

	private readonly userMediaFields = `
		userid,
		titleid,
		moviedbid,
		imdbid,
		mediatype,
		rating,
		watched,
		favorite,
		queued
	`

	public getUserTitles = async (req: TypedRequestParam<{ id: string }>, res: Response, next: NextFunction) => {

		const id = req.params.id

		if (!UtilFuncs.StringIsInt(id)) {
			res.status(ResponseCode.BadRequest).json({ error: 'invalid userid' })
			return
		}

		const sql = `select ${this.userMediaFields} from media.getUserTitle(_userid => $1)`

		await Query(sql, [id])
			.then((results) => {
				const result = new QueryResult({ code: ResponseCode.OK, result: results.rows })
				res.status(result.code).json(result.toResponseObj())
			})
	}

	public addOrUpdateUserTitle = async (req: TypedRequestBodyParam<{ id: string }, ITitleInput>, res: Response, next: NextFunction) => {

		const userId = req.params.id
		const request: AddTitleQuery = new AddTitleQuery(userId, req.body)
		const validation = request.Validate()

		if (!validation.isValid) {
			res.status(ResponseCode.BadRequest).json({ error: validation.errors })
			return
		}

		const existingTitle = await this.getUserTitle({ userId: userId, imdbId: request.input.imdbId })
		// if the title already exists, we'll update it as a part of the addUserTitle call
		// including setting it to active if it was deleted -- we just need to set the proper response code
		const code = !!existingTitle.result ? ResponseCode.OK : ResponseCode.Created

		const sql = `select ${this.userMediaFields} from media.addUserTitle(
			${request.getQueryArguments()}
		)`

		await Query(sql, request.getQueryParams())
			.then((results) => {
				const result = new QueryResult({ code: code, result: results.rows[0] })
				res.status(result.code).json(result.toResponseObj())
			})
	}

	public deleteUserTitle = async (req: TypedRequestParam<{ id: string, titleId: string }>, res: Response, next: NextFunction) => {

		const userId = req.params.id
		const titleId = req.params.titleId

		if (!UtilFuncs.StringIsInt(userId) || !UtilFuncs.StringIsInt(titleId)) {
			res.status(ResponseCode.BadRequest).json({ error: 'userid and titleid required' })
			return
		}

		const existingTitle = await this.getUserTitle({ userId: userId, titleId: titleId })

		// if the title doesn't exist (or is already deleted) return NoContent
		if (!!existingTitle.result) {
			await Query('select media.deleteUserTitle(_userid => $1, _titleid => $2)', [userId, titleId])
				.then((results) => {
					const result = new QueryResult({ code: ResponseCode.OK })
					res.status(result.code).json(result.toResponseObj())
				})
		} else {
			res.status(ResponseCode.NoContent).json({ result: 'no active user title to delete' })
		}
	}

	private getUserTitle = async ({ userId, titleId, imdbId }: GetUserTitleParams) => {

		const sql = `select ${this.userMediaFields} from media.getUserTitle(_userid => $1, _titleid => $2, _imdbid => $3)`
		const params = [userId, titleId ?? null, imdbId ?? null]

		return Query(sql, params)
			.then((results) => {
				const code = results.rows.length == 0 ? ResponseCode.NotFound : ResponseCode.OK
				const data = code == ResponseCode.OK ? results.rows[0] : null
				return new QueryResult({ code: code, result: data })
			})
	}
}

interface GetUserTitleParams {
	userId: string, titleId?: string, imdbId?: string
}

export default new UserTitle()
