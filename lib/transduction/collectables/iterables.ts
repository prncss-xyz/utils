import { id } from '@constellar/core'

import { BaseCtx, EqForm, eqForm, FoldForm, ResolvedTransducer } from './core'

export type IterableCtx = BaseCtx<number>
export function collect<S, T = S>(
	source: Iterable<S>,
	f: (f: EqForm<S, IterableCtx>) => ResolvedTransducer<S, T, IterableCtx> = id<any>,
) {
	return function <AccForm, RForm>(
    form: FoldForm<T, AccForm, RForm, IterableCtx>
  ) {
		let done = false
		const ctx = {
			close: () => {
				done = true
			},
			index: 0,
		}
		const { foldFn, result } = f(eqForm<S, IterableCtx>())(form)
		let acc = form.init()
		for (const item of source) {
			acc = foldFn(item, acc, ctx)
			if (done) break
			ctx.index++
		}
		return result(acc)
	}
}

export function asyncCollect<S, T = S>(
	source: AsyncIterable<S> | Promise<AsyncIterable<S>>,
	f: (f: EqForm<S, IterableCtx>) => ResolvedTransducer<S, T, IterableCtx> = id<any>,
) {
	return async function <AccForm, RForm>(
		form: FoldForm<T, AccForm, RForm, IterableCtx>,
	) {
		let done = false
		const ctx = {
			close: () => {
				done = true
			},
			index: 0,
		}
		const { foldFn, result } = f(eqForm<S, IterableCtx>())(form)
		let acc = form.init()
		for await (const item of await source) {
			acc = foldFn(item, acc, ctx)
			if (done) break
			ctx.index++
		}
		return result(acc)
	}
}
