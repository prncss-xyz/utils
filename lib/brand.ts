const brand = Symbol('brand')

export function Brand<Name extends string>(name: Name) {
	const domain = Symbol(name)
	return function <T>(t: T) {
		return t as T & { [brand]: Name; [domain]: true }
	}
}
