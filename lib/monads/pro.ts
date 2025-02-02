export function chain<A, B>(cb: (a: A) => Promise<B>) {
	return function (a: Promise<A>) {
		return a.then(cb)
	}
}

export function map<A, B>(cb: (a: A) => B) {
	return function (ap: Promise<A>) {
		return ap.then(cb)
	}
}

export function plus<A>(a: Promise<A>, b: A) {
	return a.then(() => b)
}

export function unit<A>(a: A) {
	return Promise.resolve(a)
}

export const zero = () => Promise.resolve()
