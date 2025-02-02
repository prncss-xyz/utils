import { fromInit, Init } from '../functions'
import { collect as collect_, FoldForm, IterableCtx } from '../transducers'

export function unit<A>(a: A) {
	return [a]
}

export function zero<A>(): A[] {
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

export function map<TFrom, TTo>(
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

export function chain<TFrom, TTo>(
	mapper: (t: TFrom, index: number, source: Iterable<TFrom>) => Iterable<TTo>,
) {
	return function (source: Iterable<TFrom>): Iterable<TTo> {
		return _chainIter(mapper, source)
	}
}

export function plus<A>(as: Array<A>, a: A) {
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

export function* pick<A>(as: Init<Iterable<A>>) {
	return (yield as) as A
}

export function* where<A>(cond: boolean) {
	if (!cond) return yield* pick(zero<A>())
}

export function* effect<T>(eff: () => T) {
	return yield* pick(() => unit(eff()))
}

export function or<A, B>(b: Init<B, []>) {
	return function (a: A[]): A[] | B {
		if (a.length === 0) return fromInit(b)
		return a
	}
}

export function collect<AccForm, RForm, S>(
	form: FoldForm<S, AccForm, RForm, IterableCtx<S>>,
) {
	return function (source: Iterable<S>) {
		return collect_(source)(form)
	}
}
