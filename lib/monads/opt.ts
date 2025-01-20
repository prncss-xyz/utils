type Monad<A> = A | undefined

function chain<A, B>(cb: (a: A) => Monad<B>) {
	return function (a: Monad<A>): Monad<B> {
		if (a === undefined) return undefined
		return cb(a)
	}
}

function map<A, B>(cb: (a: A) => B) {
	return function (a: Monad<A>): Monad<B> {
		if (a === undefined) return undefined
		return cb(a)
	}
}

function plus<A>(_a: Monad<A>, b: A): Monad<A> {
	return b
}

function unit<A>(a: A): Monad<A> {
	return a
}

function zero<A>(): Monad<A> {
	return undefined
}

export const opt = {
	chain,
	map,
	plus,
	unit,
	zero,
}
