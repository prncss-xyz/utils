import { fromInit, Init } from '../functions'

type Monad<A> = A | undefined

export function chain<A, B>(cb: (a: A) => Monad<B>) {
	return function (a: Monad<A>): Monad<B> {
		if (a === undefined) return undefined
		return cb(a)
	}
}

export function map<A, B>(cb: (a: A) => B) {
	return function (a: Monad<A>): Monad<B> {
		if (a === undefined) return undefined
		return cb(a)
	}
}

export function plus<A>(_a: Monad<A>, b: A): Monad<A> {
	return b
}

export function unit<A>(a: A): Monad<A> {
	return a
}

export function zero<A>(): Monad<A> {
	return undefined
}

export function toIter<A>(a: Monad<A>): A[] {
	if (a === undefined) return []
	return [a]
}

export function tapZero<T>(f: () => unknown) {
	return function (x: T | undefined) {
		if (x === undefined) f()
		return x
	}
}

export function or<A, B>(b: Init<B, []>) {
	return function (a: Monad<A>): A | B {
		if (a === undefined) return fromInit(b)
		return a
	}
}
