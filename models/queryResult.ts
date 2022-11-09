// enum QueryStatus {
// 	Success,
// 	Created,
// 	Failure,
// 	NotFound,
// 	Exists,
// 	InvalidRequest,
// }

type QueryResultParams = {
	code: ResponseCode,
	error?: string,
	result?: any
}

type ResponseObj = {
	error?: string,
	data?: any
}

enum ResponseCode {
	OK = 200,
	Created = 201,
	Error = 500,
	NotFound = 404,
	Conflict = 409,
	BadRequest = 400,
}

class QueryResult {
	code: ResponseCode
	error?: string
	result?: object

	// get responseCode(): number {
	// 	return this.QueryResponseMap.get(this.status) as number
	// }

	// standardize what is actually exposed to the client
	toResponseObj(): ResponseObj {
		return {
			error: this.error,
			data: this.result
		}
	}

	// private QueryResponseMap = new Map<QueryStatus, ResponseCode>([
	// 	[QueryStatus.Success, ResponseCode.OK],
	// 	[QueryStatus.Created, ResponseCode.Created],
	// 	[QueryStatus.Failure, ResponseCode.Error],
	// 	[QueryStatus.NotFound, ResponseCode.NotFound],
	// 	[QueryStatus.Exists, ResponseCode.Conflict],
	// ])

	constructor(params: QueryResultParams) {
		this.code = params.code
		this.error = params.error
		this.result = params.result
	}
}

export { QueryResult, ResponseCode }