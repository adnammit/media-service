import { Request } from 'express'
import { Query } from 'express-serve-static-core'

export interface TypedRequestBody<T> extends Request {
	body: T
}
export interface TypedRequestQuery<T extends Query> extends Express.Request {
	query: T
}

export interface TypedRequest<T extends Query, U> extends Express.Request {
	body: U,
	query: T
}
