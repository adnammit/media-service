// enum QueryStatus {
// 	Success,
// 	Created,
// 	Failure,
// 	NotFound,
// 	Exists,
// 	InvalidRequest,
// }

interface IQueryResultParams {
	code: ResponseCode,
	error?: string,
	result?: any
}

interface IResponseObj {
	error?: string,
	data?: any
}

export enum ResponseCode {
	OK = 200,
	Created = 201,
	Error = 500,
	NotFound = 404,
	Conflict = 409,
	BadRequest = 400,
}

export class QueryResult {
	code: ResponseCode
	error?: string
	result?: object

	// get responseCode(): number {
	// 	return this.QueryResponseMap.get(this.status) as number
	// }

	// standardize what is actually exposed to the client
	toResponseObj(): IResponseObj {
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

	constructor(params: IQueryResultParams) {
		this.code = params.code
		this.error = params.error
		this.result = params.result
	}
}