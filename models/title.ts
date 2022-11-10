import UtilFuncs from '../helpers/utils'

export type ITitleInput = {
	movieDbId?: string,
	imdbId?: string,
	mediaType?: string,
	rating?: string,
	watched?: string,
	favorite?: string,
	queued?: string
}

export class AddTitleQuery {
	userId: string
	input: ITitleInput

	private readonly errorPrefix = 'AddMedia input requires valid'

	constructor(userid: string, input: ITitleInput) {
		this.userId = userid
		this.input = input
	}

	public Validate(): { isValid: boolean, errors: string[] } {

		let isValid = true
		const errors: string[] = []

		if (!UtilFuncs.StringIsInt(this.userId)) {
			isValid = false
			errors.push(`${this.errorPrefix} userId`)
		}

		if (!this.input.movieDbId) {
			isValid = false
			errors.push(`${this.errorPrefix} movideDbId`)
		}

		if (!this.input.imdbId) {
			isValid = false
			errors.push(`${this.errorPrefix} imdbId`)
		}

		if (!this.input.mediaType || !UtilFuncs.IsValidMediaType(this.input.mediaType)) {
			isValid = false
			errors.push(`${this.errorPrefix} mediaType`)
		}

		return { isValid: isValid, errors: errors }
	}

	public getQueryArguments(): string {
		return `
			_userid => $1,
			_moviedbid => $2,
			_imdbid => $3,
			_mediatype => $4,
			_rating => $5,
			_watched => $6,
			_favorite => $7,
			_queued => $8
		`
	}

	public getQueryParams(): (string | null)[] {
		return [
			this.userId,
			this.input.movieDbId ?? '',
			this.input.imdbId ?? '',
			this.input.mediaType ?? null,
			this.input.rating ?? null,
			this.input.watched ?? null,
			this.input.favorite ?? null,
			this.input.queued ?? null
		]
	}
}

