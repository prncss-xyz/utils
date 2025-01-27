export interface ICtx {
	close: () => void
}

export type ResolvedTransducer<S, T, Ctx> = <AccForm, RForm>(
	form: PreFoldForm<T, AccForm, RForm, Ctx>,
) => PreFoldForm<S, AccForm, RForm, Ctx>

export interface PreFoldForm<T, Acc, R, Ctx> {
	foldFn: (t: T, acc: Acc, ctx: Ctx) => Acc
	result: (acc: Acc, ctx: Ctx) => R
}

export interface FoldForm<T, Acc, R, Ctx> extends PreFoldForm<T, Acc, R, Ctx> {
	init: () => Acc
}

export type BaseCtx<Index, UnAcc> = {
	close: () => void
	index: Index
	unAcc: UnAcc
}

export type EqForm<S, Ctx> = ResolvedTransducer<S, S, Ctx>
export function eqForm<S, Ctx>(): EqForm<S, Ctx> {
	return function <AccForm, RForm>(form: PreFoldForm<S, AccForm, RForm, Ctx>) {
		return form
	}
}
export type Transducer<Ctx, T, U> = <S>(
	a: ResolvedTransducer<S, T, Ctx>,
) => ResolvedTransducer<S, U, Ctx>
