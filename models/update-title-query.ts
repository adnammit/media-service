import UtilFuncs from '../helpers/utils'

export type IUpdateTitleInput = {
	rating?: string,
	watched?: string,
	favorite?: string,
	queued?: string
}

export class UpdateTitleQuery {
	userId: string
	titleId: string
	input: IUpdateTitleInput

	private readonly errorPrefix = 'Update title input requires valid'

	constructor(userId: string, titleId: string, input: IUpdateTitleInput) {
		this.userId = userId
		this.titleId = titleId
		this.input = input
	}

	public Validate(): { isValid: boolean, errors: string[] } {

		let isValid = true
		const errors: string[] = []

		if (!UtilFuncs.StringIsPositiveInt(this.userId) || +this.userId < 0) {
			isValid = false
			errors.push(`${this.errorPrefix} userId`)
		}

		if (!UtilFuncs.StringIsPositiveInt(this.titleId) || +this.titleId < 0) {
			isValid = false
			errors.push(`${this.errorPrefix} titleId`)
		}

		// if (!UtilFuncs.StringIsPositiveInt(this.input.rating) || this.input.rating > 5) {
		// 	isValid = false
		// 	errors.push(`${this.errorPrefix} rating`)
		// }

		if (!!this.input.watched && !UtilFuncs.IsBoolean(this.input.watched)) {
			isValid = false
			errors.push(`${this.errorPrefix} watched`)
		}

		if (!!this.input.favorite && !UtilFuncs.IsBoolean(this.input.favorite)) {
			isValid = false
			errors.push(`${this.errorPrefix} favorite`)
		}

		if (!!this.input.queued && !UtilFuncs.IsBoolean(this.input.queued)) {
			isValid = false
			errors.push(`${this.errorPrefix} queued`)
		}

		return { isValid: isValid, errors: errors }
	}

	public getQueryArguments(): string {
		return `
			_userid => $1,
			_titleid => $2,
			_rating => $3,
			_watched => $4,
			_favorite => $5,
			_queued => $6
		`
	}

	public getQueryParams(): (string | null)[] {
		return [
			this.userId,
			this.titleId,
			this.input.rating ?? null,
			this.input.watched ?? null,
			this.input.favorite ?? null,
			this.input.queued ?? null
		]
	}
}

