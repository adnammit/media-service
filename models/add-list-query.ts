import UtilFuncs from '../helpers/utils'

export type IListInput = {
	name?: string,
	description?: string,
}

export class AddListQuery {
	userId: string
	input: IListInput

	private readonly errorPrefix = 'Add User List input requires valid'

	constructor(userId: string, input: IListInput) {
		this.userId = userId
		this.input = input
	}

	public Validate(): { isValid: boolean, errors: string[] } {

		let isValid = true
		const errors: string[] = []

		if (!UtilFuncs.StringIsPositiveInt(this.userId) || +this.userId < 0) {
			isValid = false
			errors.push(`${this.errorPrefix} userId`)
		}

		if (!this.input.name) {
			isValid = false
			errors.push(`${this.errorPrefix} name`)
		}

		return { isValid: isValid, errors: errors }
	}

	public getQueryArguments(): string {
		return `
			_userid => $1,
			_name => $2,
			_description => $3
		`
	}

	public getQueryParams(): (string | null)[] {
		return [
			this.userId,
			this.input.name ?? null,
			this.input.description ?? null
		]
	}
}

