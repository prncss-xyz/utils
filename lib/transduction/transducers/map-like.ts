import { BaseCtx, ResolvedTransducer, Transducer } from '../collectables'

export function map<A, B, Ctx extends BaseCtx<unknown, unknown>>(
	mod: (a: A, index: Ctx['index'], source: Ctx['unAcc']) => B,
): Transducer<Ctx, A, B> {
	return function <S>(p: ResolvedTransducer<S, A, Ctx>) {
		return function ({ foldFn, result }) {
			return p({
				foldFn: (t, acc, ctx) => foldFn(mod(t, ctx.index, ctx.unAcc), acc, ctx),
				result,
			})
		}
	}
}

export function ap<A, B, Ctx extends BaseCtx<unknown, unknown>>(
	...mods: ((a: A, index: Ctx['index'], value: Ctx['unAcc']) => B)[]
): Transducer<Ctx, A, B> {
	return function <S>(p: ResolvedTransducer<S, A, Ctx>) {
		return function ({ foldFn, result }) {
			return p({
				foldFn(t, acc, ctx) {
					for (const mod of mods) {
						acc = foldFn(mod(t, ctx.index, ctx.unAcc), acc, ctx)
					}
					return acc
				},
				result,
			})
		}
	}
}
