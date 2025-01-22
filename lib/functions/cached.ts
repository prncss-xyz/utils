const INIT = Symbol('INIT')

export function memo1<A, R>(f: (a: A) => R): (a: A) => R {
	let a_: A | typeof INIT = INIT
	let memo: R
	return (a: A) => {
		if (!Object.is(a_, a)) {
			memo = f(a)
			a_ = a
		}
		return memo
	}
}
