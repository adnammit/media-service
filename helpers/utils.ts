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

	public GroupById<T, K extends keyof any>(arr: T[], key: (i: T) => K) {
		return arr.reduce((groups, item) => {
			(groups[key(item)] ||= []).push(item)
			return groups
		}, {} as Record<K, T[]>)
	}
}

export default new UtilFuncs();
