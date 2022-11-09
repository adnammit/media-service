import { Request } from 'express'
import { Query, Params } from 'express-serve-static-core'

export interface TypedRequestBody<T> extends Request {
	body: T
}
export interface TypedRequestQuery<T extends Query> extends Express.Request {
	query: T
}

export interface TypedRequestParam<T extends Params> extends Express.Request {
	params: T
}

export interface TypedRequestBodyParam<T extends Params, U> extends Express.Request {
	body: U,
	params: T
}

export interface TypedRequestBodyQuery<T extends Query, U> extends Express.Request {
	body: U,
	query: T
}
