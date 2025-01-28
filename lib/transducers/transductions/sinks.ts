import { id } from '@constellar/core'

import { Source } from '../sources'
import { BaseCtx, EqForm, eqForm, FoldForm, ResolvedTransducer } from './core'

export function collectSink<S, UnAcc, Index, T>(
	source: Source<S, Index, UnAcc>,
	f: (
		f: EqForm<S, BaseCtx<Index, UnAcc>>,
	) => ResolvedTransducer<S, T, BaseCtx<Index, UnAcc>> = id<any>,
) {
	return function <AccForm, RForm>(
		form: FoldForm<T, AccForm, RForm, BaseCtx<Index, UnAcc>>,
	) {
		let done = false
		const [index, unAcc] = source.init
		const ctx: BaseCtx<Index, UnAcc> = {
			close: () => {
				done = true
			},
			index,
			unAcc,
		}
		const { foldFn, result } = f(eqForm<S, BaseCtx<Index, UnAcc>>())(form)
		let acc = form.init()
		while (true) {
			const r = source.step(ctx.index, ctx.unAcc)
			if (r === undefined) break
			const [value, nextIndex, nextUnAcc] = r
			acc = foldFn(value, acc, ctx)
			if (done) break
			ctx.index = nextIndex
			ctx.unAcc = nextUnAcc
		}
		return result(acc, ctx)
	}
}
