const INIT = Symbol('INIT')

export function once0<R>(f: () => R): () => R {
	let first = true
	let value: R
	return () => {
		if (first) {
			first = false
			value = f()
		}
		return value
	}
}

export function once1<K, T>(fn: (k: K) => T) {
	let cache = new Map<K, T>()
	return function (k: K): T {
		if (cache.has(k)) {
			return cache.get(k)!
		}
		cache.set(k, fn(k))
		return cache.get(k)!
	}
}

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
