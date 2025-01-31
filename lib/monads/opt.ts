import { fromInit, Init } from '../functions'

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

function toIter<A>(a: Monad<A>): A[] {
	if (a === undefined) return []
	return [a]
}

function tapZero<T>(f: () => unknown) {
	return function (x: T | undefined) {
		if (x === undefined) f()
		return x
	}
}

function or<A, B>(a: Monad<A>, b: Init<B, []>): Monad<A | B> {
	if (a === undefined) return fromInit(b)
	return a
}

export const opt = {
	chain,
	map,
	or,
	plus,
	tapZero,
	toIter,
	unit,
	zero,
}
