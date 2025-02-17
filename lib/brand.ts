export const _brand = Symbol('brand')

export type Brand<Name extends string, T = unknown> = T & { [_brand]: Name }

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function brand<Name extends string>(name: Name) {
	return function <T>(t: T) {
		return t as Brand<Name, T>
	}
}
