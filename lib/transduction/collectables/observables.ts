import { id, isFunction } from '@constellar/core'

import { BaseCtx, eqForm, EqForm, FoldForm, ResolvedTransducer } from './core'

type Observer<V, F> =
	| ((value: V) => void)
	| {
			complete(final: F): void
			next(value: V): void
	  }

function normalizeObserver<V, F>(observer: Observer<V, F>) {
	if (isFunction(observer)) return { complete() {}, next: observer }
	return observer
}

export type ObservableCtx = BaseCtx<number> & {}

export function collectObservable<S>() {
	return function <AccForm, RForm, T = S>(
		f: (
			f: EqForm<S, ObservableCtx>,
		) => ResolvedTransducer<S, T, ObservableCtx> = id<any>,
		observer: Observer<AccForm, RForm>,
		form: FoldForm<T, AccForm, RForm, ObservableCtx>,
	) {
		let done = false
		const ctx = {
			close: () => {
				done = true
			},
			index: 0,
			next,
		}
		const o = normalizeObserver(observer)
		const { foldFn, result } = f(eqForm<S, ObservableCtx>())(form)
		let acc = form.init()
		function next(item: S) {
			if (done) return
			ctx.index = Date.now()
			acc = foldFn(item, acc, ctx)
			o.next(acc)
			if (done) o.complete(result(acc))
		}
		function close() {
			done = true
		}
		return { close, next }
	}
}
