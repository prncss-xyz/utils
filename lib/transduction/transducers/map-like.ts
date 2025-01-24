import { ResolvedTransducer, Transducer } from '../collectables'

export function map<A, B, Ctx extends { index: unknown }>(
	mod: (a: A, index: Ctx['index']) => B,
): Transducer<Ctx, A, B> {
	return function <S>(p: ResolvedTransducer<S, A, Ctx>) {
		return function ({ foldFn, result }) {
			return p({
				foldFn: (t, acc, ctx) => foldFn(mod(t, ctx.index), acc, ctx),
				result,
			})
		}
	}
}

export function ap<A, B, Ctx extends { index: unknown }>(
	...mods: ((a: A, index: Ctx['index']) => B)[]
): Transducer<Ctx, A, B> {
	return function <S>(p: ResolvedTransducer<S, A, Ctx>) {
		return function ({ foldFn, result }) {
			return p({
				foldFn(t, acc, ctx) {
					for (const mod of mods) {
						acc = foldFn(mod(t, ctx.index), acc, ctx)
					}
					return acc
				},
				result,
			})
		}
	}
}
