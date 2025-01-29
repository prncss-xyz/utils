import { id } from '@constellar/core'

import { BaseCtx, EqForm, eqForm, FoldForm, ResolvedTransducer } from './core'

export function collectIndexed<Index, Source, Target = Source>(
	source: Iterable<[Index, Source]>,
	f: (
		f: EqForm<Source, BaseCtx<Index, Iterable<[Index, Source]>>>,
	) => ResolvedTransducer<
		Source,
		Target,
		BaseCtx<Index, Iterable<[Index, Source]>>
	> = id<any>,
) {
	return function <AccForm, RForm>(
		form: FoldForm<
			Target,
			AccForm,
			RForm,
			BaseCtx<Index, Iterable<[Index, Source]>>
		>,
	) {
		let done = false
		const ctx = {
			close: () => {
				done = true
			},
			index: undefined as Index,
			unAcc: source,
		}
		const { foldFn, result } = f(eqForm())(form)
		let acc = form.init()
		for (const [k, v] of source) {
			ctx.index = k
			acc = foldFn(v, acc, ctx)
			if (done) break
		}
		return result(acc, ctx)
	}
}
