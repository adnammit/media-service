import { MediaType } from '../models/media-type';

export class UtilFuncs {

	// returns true if string is a valid, positive int. returns false for any other case
	public StringIsPositiveInt(val?: string): boolean {
		if (!val) return false
		return /^\d+$/.test(val.trim())
	}

	public IsValidMediaType(val?: any): boolean {
		return Object.values(MediaType).some((t) => t === val)
	}

	public IsBoolean(val?: any): boolean {
		if (typeof val === 'boolean') return true
		return typeof val === 'string' && (val?.toLocaleLowerCase() == 'true' || val?.toLocaleLowerCase() == 'false')
			? true
			: false
	}
}

export default new UtilFuncs();
