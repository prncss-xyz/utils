import { id } from '@constellar/core'

import { BaseCtx, EqForm, eqForm, FoldForm, ResolvedTransducer } from './core'

export function collectIndexed<Index, Source, Target = Source>(
	source: Iterable<[Index, Source]>,
	f: (
		f: EqForm<Source, BaseCtx<Index>>,
	) => ResolvedTransducer<Source, Target, BaseCtx<Index>> = id<any>,
) {
	return function <AccForm, RForm>(
		form: FoldForm<Target, AccForm, RForm, BaseCtx<Index>>,
	) {
		let done = false
		const ctx = {
			close: () => {
				done = true
			},
			index: undefined as Index,
		}
		const { foldFn, result } = f(eqForm())(form)
		let acc = form.init()
		for (const [k, v] of source) {
			ctx.index = k
			acc = foldFn(v, acc, ctx)
			if (done) break
		}
		return result(acc)
	}
}
