import { id } from '@constellar/core'

import { BaseCtx, EqForm, eqForm, FoldForm, ResolvedTransducer } from './core'

export type IterableCtx<S> = BaseCtx<number, Iterable<S>>
export function collect<S, T = S>(
	source: Iterable<S>,
	f: (
		f: EqForm<S, IterableCtx<S>>,
	) => ResolvedTransducer<S, T, IterableCtx<S>> = id<any>,
) {
	return function <AccForm, RForm>(
		form: FoldForm<T, AccForm, RForm, IterableCtx<S>>,
	) {
		let done = false
		const ctx = {
			close: () => {
				done = true
			},
			index: 0,
			unAcc: source,
		}
		const { foldFn, result } = f(eqForm<S, IterableCtx<S>>())(form)
		let acc = form.init()
		for (const item of source) {
			acc = foldFn(item, acc, ctx)
			if (done) break
			ctx.index++
		}
		return result(acc, ctx)
	}
}

export type AsyncIterableCtx<S> = BaseCtx<
	number,
	AsyncIterable<S> | Promise<AsyncIterable<S>>
>
export function asyncCollect<S, T = S>(
	source: AsyncIterable<S> | Promise<AsyncIterable<S>>,
	f: (
		f: EqForm<S, AsyncIterableCtx<S>>,
	) => ResolvedTransducer<S, T, AsyncIterableCtx<S>> = id<any>,
) {
	return async function <AccForm, RForm>(
		form: FoldForm<T, AccForm, RForm, AsyncIterableCtx<S>>,
	) {
		let done = false
		const ctx = {
			close: () => {
				done = true
			},
			index: 0,
			unAcc: source,
		}
		const { foldFn, result } = f(eqForm<S, AsyncIterableCtx<S>>())(form)
		let acc = form.init()
		for await (const item of await source) {
			acc = foldFn(item, acc, ctx)
			if (done) break
			ctx.index++
		}
		return result(acc, ctx)
	}
}
