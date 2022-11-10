import { ResponseCode } from '../models/response-code'

type QueryResultParams = {
	code: ResponseCode,
	error?: string,
	result?: any
}

// standardize what is actually exposed to the client and allow for easy extension of this object
type ResponseObj = {
	error?: string,
	data?: any
}

class QueryResult {
	code: ResponseCode
	error?: string
	result?: object

	toResponseObj(): ResponseObj {
		return {
			error: this.error,
			data: this.result
		}
	}

	constructor(params: QueryResultParams) {
		this.code = params.code
		this.error = params.error
		this.result = params.result
	}
}

export { QueryResult }