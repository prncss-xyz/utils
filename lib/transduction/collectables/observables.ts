import { id, isFunction } from '@constellar/core'

import { BaseCtx, eqForm, EqForm, FoldForm, ResolvedTransducer } from './core'

export type Observer<V, F> =
	| ((value: V) => void)
	| Partial<{
			complete(final: F): void
			next(value: V): void
	  }>

function normalizeObserver<V, F>(observer: Observer<V, F>) {
	if (isFunction(observer)) return { complete() {}, next: observer }
	return {
		complete: observer.complete ?? (() => {}),
		next: observer.next ?? (() => {}),
	}
}

export function collectObservable<S>() {
	return function <AccForm, RForm, T = S>(
		observer: Observer<AccForm, RForm>,
		form: FoldForm<
			T,
			AccForm,
			RForm,
			BaseCtx<number, Observer<AccForm, RForm>>
		>,
		f: (
			f: EqForm<S, BaseCtx<number, Observer<AccForm, RForm>>>,
		) => ResolvedTransducer<
			S,
			T,
			BaseCtx<number, Observer<AccForm, RForm>>
		> = id as any,
	) {
		let done = false
		const ctx = {
			close: () => {
				done = true
			},
			index: 0,
			next,
			unAcc: observer,
		}
		const o = normalizeObserver(observer)
		const { foldFn, result } =
			f(eqForm<S, BaseCtx<number, Observer<AccForm, RForm>>>())(form)
		let acc = form.init()
		function next(item: S) {
			if (done) return
			ctx.index = Date.now()
			acc = foldFn(item, acc, ctx)
			o.next(acc)
			if (done) o.complete(result(acc, ctx))
		}
		function close() {
			done = true
			if (done) o.complete(result(acc, ctx))
		}
		return { close, next }
	}
}
