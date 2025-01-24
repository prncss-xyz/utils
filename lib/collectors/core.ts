import { id } from '@constellar/core'

export interface ICtx {
	close: () => void
}

export type ResolvedTransducer<S, T, Ctx> = <AccForm, RForm>(
	form: PreFoldForm<T, AccForm, RForm, Ctx>,
) => PreFoldForm<S, AccForm, RForm, Ctx>

export interface PreFoldForm<T, Acc, R, Ctx> {
	foldFn: (t: T, acc: Acc, ctx: Ctx) => Acc
	result: (acc: Acc) => R
}

export interface FoldForm<T, Acc, R, Ctx> extends PreFoldForm<T, Acc, R, Ctx> {
	init: () => Acc
}

export type IterCtx = {
	close: () => void
	index: number
}

type EqForm<S, Ctx> = ResolvedTransducer<S, S, Ctx>
function eqForm<S, Ctx>(): EqForm<S, Ctx> {
	return function <AccForm, RForm>(form: PreFoldForm<S, AccForm, RForm, Ctx>) {
		return form
	}
}
export type Transducer<Ctx, T, U> = <S>(
	a: ResolvedTransducer<S, T, Ctx>,
) => ResolvedTransducer<S, U, Ctx>

export function collect0<S, T = S>(
	source: Iterable<S>,
	f: (f: EqForm<S, IterCtx>) => ResolvedTransducer<S, T, IterCtx> = id<any>,
) {
	return function <AccForm, RForm>(form: FoldForm<T, AccForm, RForm, IterCtx>) {
		let done = false
		const ctx = {
			close: () => {
				done = true
			},
			index: 0,
		}
		const { foldFn, result } = f(eqForm<S, IterCtx>())(form)
		let acc = form.init()
		for (const item of source) {
			acc = foldFn(item, acc, ctx)
			if (done) break
			ctx.index++
		}
		return result(acc)
	}
}

export function collect<S, T = S>(
	source: Iterable<S>,
	f: (f: EqForm<S, IterCtx>) => ResolvedTransducer<S, T, IterCtx> = id<any>,
) {
	return function <AccForm, RForm>(form: FoldForm<T, AccForm, RForm, IterCtx>) {
		let done = false
		const ctx = {
			close: () => {
				done = true
			},
			index: 0,
		}
		const { foldFn, result } = f(eqForm<S, IterCtx>())(form)
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
	f: (f: EqForm<S, IterCtx>) => ResolvedTransducer<S, T, IterCtx> = id<any>,
) {
	return async function <AccForm, RForm>(
		form: FoldForm<T, AccForm, RForm, IterCtx>,
	) {
		let done = false
		const ctx = {
			close: () => {
				done = true
			},
			index: 0,
		}
		const { foldFn, result } = f(eqForm<S, IterCtx>())(form)
		let acc = form.init()
		for await (const item of await source) {
			acc = foldFn(item, acc, ctx)
			if (done) break
			ctx.index++
		}
		return result(acc)
	}
}
