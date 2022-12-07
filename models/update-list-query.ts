import UtilFuncs from '../helpers/utils'
import { IListInput } from './add-list-query'

export class UpdateListQuery {
	listId: string
	input: IListInput

	private readonly errorPrefix = 'Update User List input requires valid'

	constructor(listId: string, input: IListInput) {
		this.listId = listId
		this.input = input
	}

	public Validate(): { isValid: boolean, errors: string[] } {

		let isValid = true
		const errors: string[] = []

		if (!UtilFuncs.StringIsPositiveInt(this.listId) || +this.listId < 0) {
			isValid = false
			errors.push(`${this.errorPrefix} listId`)
		}

		return { isValid: isValid, errors: errors }
	}

	public getQueryArguments(): string {
		return `
			_listid => $1,
			_name => $2,
			_description => $3
		`
	}

	public getQueryParams(): (string | null)[] {
		return [
			this.listId,
			this.input.name ?? null,
			this.input.description ?? null
		]
	}
}

