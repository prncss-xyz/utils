export const _brand = Symbol('brand')

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function brand<Name extends string>(name: Name) {
	return function <T>(t: T) {
		return t as T & { [_brand]: Name }
	}
}
