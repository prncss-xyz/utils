export const brand = Symbol('brand')

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Brand<Name extends string>(name: Name) {
	return function <T>(t: T) {
		return t as T & { [brand]: Name }
	}
}
