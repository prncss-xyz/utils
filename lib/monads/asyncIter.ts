import { fromInit, Init } from '../functions'
import { asyncCollect, AsyncIterableCtx, FoldForm } from '../transducers'

export function unit<A>(a: A) {
	return [a]
}

async function* asyncUnit<A>(a: A) {
	yield a
}

export function zero<A>(): A[] {
	return []
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

export function chain<TFrom, TTo>(
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
export function map<TFrom, TTo>(
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

export function filter<TFrom>(
	predicate: (
		t: TFrom,
		index: number,
		source:
			| AsyncIterable<Promise<TFrom> | TFrom>
			| Iterable<Promise<TFrom> | TFrom>,
	) => Promise<unknown> | unknown,
) {
	return async function* inner(
		source:
			| AsyncIterable<Promise<TFrom> | TFrom>
			| Iterable<Promise<TFrom> | TFrom>,
	) {
		let index = 0
		for await (const item of source) {
			if (await predicate(item, index++, source)) yield item
		}
	}
}

function plus<T>(ts: Array<T>, a: T) {
	return Array.prototype.concat(ts, a)
}

export function multi<N, R>(
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

export function* pick<T>(ts: Init<AsyncIterable<T>>) {
	return (yield ts) as T
}

export async function* effect<T>(eff: () => Promise<T>) {
	return yield* pick(() => asyncUnit(eff()))
}

export function collect<AccForm, RForm, S>(
	form: FoldForm<S, AccForm, RForm, AsyncIterableCtx<S>>,
) {
	return function (source: AsyncIterable<S> | Promise<AsyncIterable<S>>) {
		return asyncCollect(source)(form)
	}
}
