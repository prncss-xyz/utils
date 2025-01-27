import { BaseCtx, ResolvedTransducer, Transducer } from '../collectables'

export function chain<A, B, Ctx extends BaseCtx<unknown, unknown>>(
	mod: (
		a: A,
		index: Ctx['index'],
		source: Ctx['unAcc'],
	) => B[],
): Transducer<Ctx, A, B> {
	return function <S>(p: ResolvedTransducer<S, A, Ctx>) {
		return function ({ foldFn, result }) {
			return p({
				foldFn(t, acc, ctx) {
					for (const v of mod(t, ctx.index, ctx.unAcc)) {
						acc = foldFn(v, acc, ctx)
					}
					return acc
				},
				result,
			})
		}
	}
}

export function flatten<
	A,
	Ctx extends BaseCtx<unknown, unknown>,
>(): Transducer<Ctx, A[], A> {
	return function <S>(p: ResolvedTransducer<S, A[], Ctx>) {
		return function ({ foldFn, result }) {
			return p({
				foldFn(t, acc, ctx) {
					for (const v of t) {
						acc = foldFn(v, acc, ctx)
					}
					return acc
				},
				result,
			})
		}
	}
}
