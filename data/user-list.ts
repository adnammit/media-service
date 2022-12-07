import { Response, NextFunction } from 'express'
import { ResponseCode } from '../models/response-code'
import { TypedRequestBodyParam, TypedRequestParam } from '../models/typed-request'
import { QueryResult } from '../models/query-result'
import { AddListQuery, IListInput } from '../models/add-list-query'
import { UpdateListQuery } from '../models/update-list-query'
import UserListResult from '../models/user-list-result'
import UtilFuncs from '../helpers/utils'
import { Query } from './pool'

export class UserList {

	private readonly listFields = `
		listid,
		userid,
		name,
		description
	`

	private readonly listItemFields = `
		listid,
		userid,
		name,
		description,
		titleid
	`

	private readonly itemFields = `
		listitemid,
		listid,
		titleid
	`

	public getUserLists = async (req: TypedRequestParam<{ id: string }>, res: Response, next: NextFunction) => {

		const id = req.params.id

		if (!UtilFuncs.StringIsPositiveInt(id)) {
			res.status(ResponseCode.BadRequest).json({ error: 'invalid userid' })
			return
		}

		const sql = `select ${this.listItemFields} from media.getUserLists(_userid => $1)`

		await Query(sql, [id])
			.then((results) => {
				const lists = this.parseUserList(results.rows, +id)
				const result = new QueryResult({ code: ResponseCode.OK, result: lists })
				res.status(result.code).json(result.toResponseObj())
			})
	}

	public addUserList = async (req: TypedRequestBodyParam<{ id: string }, IListInput>, res: Response, next: NextFunction) => {

		const userId = req.params.id
		const request: AddListQuery = new AddListQuery(userId, req.body)
		const validation = request.Validate()

		if (!validation.isValid) {
			res.status(ResponseCode.BadRequest).json({ error: validation.errors })
			return
		}

		const sql = `select ${this.listFields} from media.addUserList(${request.getQueryArguments()})`

		await Query(sql, request.getQueryParams())
			.then((results) => {
				const result = new QueryResult({ code: ResponseCode.Created, result: results.rows[0] })
				res.status(result.code).json(result.toResponseObj())
			})
	}

	public updateUserList = async (req: TypedRequestBodyParam<{ id: string }, IListInput>, res: Response, next: NextFunction) => {

		const listId = req.params.id

		const request: UpdateListQuery = new UpdateListQuery(listId, req.body)
		const validation = request.Validate()

		if (!validation.isValid) {
			res.status(ResponseCode.BadRequest).json({ error: validation.errors })
			return
		}

		const sql = `select ${this.listFields} from media.updateUserList(
			${request.getQueryArguments()}
		)`

		await Query(sql, request.getQueryParams())
			.then((results) => {
				let result: QueryResult
				if (results.rows.length > 0) {
					result = new QueryResult({ code: ResponseCode.OK, result: results.rows[0] })
				} else {
					result = new QueryResult({ code: ResponseCode.NotFound, error: "Could not find list to update" })
				}
				res.status(result.code).json(result.toResponseObj())
			})
	}

	public deleteUserList = async (req: TypedRequestParam<{ id: string }>, res: Response, next: NextFunction) => {

		const listId = req.params.id

		if (!UtilFuncs.StringIsPositiveInt(listId)) {
			res.status(ResponseCode.BadRequest).json({ error: 'listId required' })
			return
		}

		await Query('select media.deleteUserList(_listid => $1)', [listId])
			.then((results) => {
				const result = new QueryResult({ code: ResponseCode.OK })
				res.status(result.code).json(result.toResponseObj())
			})
	}


	public addUserListItem = async (req: TypedRequestParam<{ id: string, titleId: string }>, res: Response, next: NextFunction) => {

		const listId = req.params.id
		const titleId = req.params.titleId

		if (!UtilFuncs.StringIsPositiveInt(listId) || !UtilFuncs.StringIsPositiveInt(titleId)) {
			res.status(ResponseCode.BadRequest).json({ error: 'listId and titleId required' })
			return
		}

		const sql = `select ${this.itemFields} from media.addUserListItem(_listid => $1, _titleid => $2)`

		await Query(sql, [listId, titleId])
			.then((results) => {
				const result = new QueryResult({ code: ResponseCode.Created, result: results.rows[0] })
				res.status(result.code).json(result.toResponseObj())
			})
	}

	public deleteUserListItem = async (req: TypedRequestParam<{ id: string, titleId: string }>, res: Response, next: NextFunction) => {

		const listId = req.params.id
		const titleId = req.params.titleId

		if (!UtilFuncs.StringIsPositiveInt(listId) || !UtilFuncs.StringIsPositiveInt(titleId)) {
			res.status(ResponseCode.BadRequest).json({ error: 'listId and titleId required' })
			return
		}

		await Query('select media.deleteUserListItem(_listid => $1, _titleid => $2)', [listId, titleId])
			.then((results) => {
				const result = new QueryResult({ code: ResponseCode.OK })
				res.status(result.code).json(result.toResponseObj())
			})
	}

	private parseUserList = (rows: any[], id: number): UserListResult[] => {
		// unique list of lists
		const lists = [...new Map(rows.map(row =>
			[row['listid'], {
				userId: id,
				listId: +row.listid,
				name: row.name as string,
				description: row.description as string,
				titleIds: []
			} as UserListResult])).values()]

		// populate with titles:
		lists.forEach((list: UserListResult) => {
			list.titleIds = rows.filter(row => row.listid == list.listId && row.titleid != null)
				.map(row => row.titleid)
		})

		return lists
	}
}

export default new UserList()
