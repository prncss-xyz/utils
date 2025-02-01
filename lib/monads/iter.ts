import { fromInit, Init } from '../functions'

function unit<A>(a: A) {
	return [a]
}

async function* asyncUnit<A>(a: A) {
	yield a
}

function zero<A>(): A[] {
	return []
}

function* _mapIter<TFrom, TTo>(
	mapper: (a: TFrom, index: number, source: Iterable<TFrom>) => TTo,
	source: Iterable<TFrom>,
): Iterable<TTo> {
	let index = 0
	for (const item of source) {
		yield mapper(item, index++, source)
	}
}

function _map<TFrom, TTo>(
	mapper: (a: TFrom, index: number, source: Iterable<TFrom>) => TTo,
	source: Iterable<TFrom>,
): Iterable<TTo> {
	if (Array.isArray(source)) return source.map(mapper)
	return _mapIter(mapper, source)
}

function map<TFrom, TTo>(
	mapper: (a: TFrom, index: number, source: Iterable<TFrom>) => TTo,
) {
	return function (source: Iterable<TFrom>): Iterable<TTo> {
		return _map(mapper, source)
	}
}

function* _chainIter<TFrom, TTo>(
	mapper: (t: TFrom, index: number, source: Iterable<TFrom>) => Iterable<TTo>,
	source: Iterable<TFrom>,
): Iterable<TTo> {
	let index = 0
	for (const item of source) {
		for (const nestedItem of mapper(item, index++, source)) {
			yield nestedItem
		}
	}
}

async function* _asyncChainIter<TFrom, TTo>(
	mapper: (
		t: TFrom,
		index: number,
		source: AsyncIterable<TFrom> | Iterable<TFrom>,
	) => Promise<AsyncIterable<TTo>>,
	source: AsyncIterable<TFrom> | Iterable<TFrom>,
): AsyncIterable<TTo> {
	let index = 0
	for await (const item of source) {
		for await (const nestedItem of await mapper(item, index++, source)) {
			yield nestedItem
		}
	}
}

function chain<TFrom, TTo>(
	mapper: (t: TFrom, index: number, source: Iterable<TFrom>) => Iterable<TTo>,
) {
	return function (source: Iterable<TFrom>): Iterable<TTo> {
		return _chainIter(mapper, source)
	}
}

export async function asyncChain_<TFrom, TTo>(
	mapper: (
		t: TFrom,
	) =>
		| AsyncIterable<Promise<TTo> | TTo>
		| Iterable<TTo>
		| Promise<AsyncIterable<Promise<TTo> | TTo> | Iterable<TTo>>,
) {
	return async function* inner(
		source:
			| AsyncIterable<Promise<TFrom> | TFrom>
			| Iterable<Promise<TFrom> | TFrom>
			| Promise<
					| AsyncIterable<Promise<TFrom> | TFrom>
					| Iterable<Promise<TFrom> | TFrom>
			  >,
	) {
		for await (const item of await source) {
			for await (const nestedItem of await mapper(item)) {
				yield nestedItem
			}
		}
	}
}

// https://github.com/jamiemccrindle/axax/blob/0020e8f55d79fa61a26d8266aeeccf2546a3d766/src/map.ts
export function asyncMap<TFrom, TTo>(
	mapper: (
		t: TFrom,
		index: number,
		source:
			| AsyncIterable<Promise<TFrom> | TFrom>
			| Iterable<Promise<TFrom> | TFrom>,
	) => Promise<TTo> | TTo,
) {
	return async function* inner(
		source:
			| AsyncIterable<Promise<TFrom> | TFrom>
			| Iterable<Promise<TFrom> | TFrom>,
	) {
		let index = 0
		for await (const item of source) {
			yield await mapper(item, index++, source)
		}
	}
}

function plus<A>(as: Array<A>, a: A) {
	return Array.prototype.concat(as, a)
}

// https://medium.com/flock-community/monads-simplified-with-generators-in-typescript-part-1-33486bf9d887
export function multi<N, R>(
	genFn: () => Generator<Init<Iterable<N>>, R, N>,
): Iterable<R> {
	return run([])
	function run(history: Array<N>): Iterable<R> {
		const g = genFn()
		let yielded = g.next()
		for (const next of history) {
			yielded = g.next(next)
		}
		if (yielded.done) {
			return unit(yielded.value)
		}
		const { value } = yielded
		return chain((next: N) => run(plus(history, next)))(fromInit(value))
	}
}

export function asyncMulti<N, R>(
	genFn: () => AsyncGenerator<Init<AsyncIterable<N> | Iterable<N>>, R, N>,
): Promise<AsyncIterable<R>> {
	return run([])
	async function run(history: Array<N>): Promise<AsyncIterable<R>> {
		const g = genFn()
		let yielded = await g.next()
		for (const next of history) {
			yielded = await g.next(next)
		}
		if (yielded.done) {
			return asyncUnit(yielded.value)
		}
		const { value } = yielded
		return _asyncChainIter(
			(next: N) => run(plus(history, next)),
			fromInit(value),
		)
	}
}

export function* pick<A>(as: Init<Iterable<A>>) {
	return (yield as) as A
}

export function* asyncPick<A>(as: Init<AsyncIterable<A>>) {
	return (yield as) as A
}

export function* where<A>(cond: boolean) {
	if (!cond) return yield* pick(zero<A>())
}

export function* effect<T>(eff: () => T) {
	return yield* pick(() => unit(eff()))
}

export async function* asyncEffect<T>(eff: () => Promise<T>) {
	return yield* asyncPick(() => asyncUnit(eff()))
}

export const arr = {
	chain,
	map,
	plus,
	tapZero<A>(f: () => unknown) {
		return function (x: A[]) {
			if (x.length === 0) f()
			return x
		}
	},
	unit,
	zero,
}

export const asyncArr = {
	chain: asyncChain_,
	map: asyncMap,
	plus,
	unit,
	zero,
}
