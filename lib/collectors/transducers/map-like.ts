import { FormArg, TransForm } from '../core'

export function map<A, B, Ctx extends { index: unknown }>(
	mod: (a: A, index: Ctx['index']) => B,
): TransForm<Ctx, A, B> {
	return function <S>(p: FormArg<S, A, Ctx>) {
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
): TransForm<Ctx, A, B> {
	return function <S>(p: FormArg<S, A, Ctx>) {
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
