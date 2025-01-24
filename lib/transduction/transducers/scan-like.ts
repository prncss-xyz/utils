import { FoldForm, ResolvedTransducer, Transducer } from '../collectables'
import { arrayForm } from '../forms'

export function scan<R, Acc, Ctx, T>(
	form: FoldForm<T, Acc, R, Ctx & { index: number }> = arrayForm<
		T,
		Ctx & { index: number }
	>() as any,
): Transducer<Ctx, T, R> {
	return function <S>(p: ResolvedTransducer<S, T, Ctx>) {
		return function ({ foldFn, result }) {
			let innerCtx: Ctx & { index: number }
			let innerAcc = form.init()
			return p({
				foldFn(next, acc, ctx) {
					innerCtx ??= { ...ctx, index: 0 }
					innerAcc = form.foldFn(next, innerAcc, innerCtx)
					const a = foldFn(form.result(innerAcc), acc, ctx)
					innerCtx.index++
					return a
				},
				result,
			})
		}
	}
}

export function group<T, Ctx>(
	eq: (next: T, last: T, ctx: Ctx) => unknown,
): Transducer<Ctx, T, T[]>
export function group<T, R, Acc, Ctx>(
	eq: (next: T, last: T, ctx: Ctx) => unknown,
	form: FoldForm<T, Acc, R, unknown>,
): Transducer<Ctx, T, R>
export function group<T, R, Acc, Ctx>(
	eq: (next: T, last: T, ctx: Ctx) => unknown,
	form: FoldForm<T, Acc, R, Ctx & { index: number }> = arrayForm<
		T,
		Ctx & { index: number }
	>() as any,
): Transducer<Ctx, T, R> {
	return function <S>(p: ResolvedTransducer<S, T, Ctx>) {
		return function ({ foldFn, result }) {
			let innerAcc = form.init()
			let last: T | undefined
			let innerCtx: Ctx & { index: number }
			let getResult: (acc: any) => any
			return p({
				foldFn(next, acc, ctx) {
					innerCtx ??= { ...ctx, index: 0 }
					getResult ??= (acc) => result(foldFn(form.result(innerAcc), acc, ctx))
					if (last === undefined || eq(next, last, ctx)) {
						innerAcc = form.foldFn(next, innerAcc, innerCtx)
						innerCtx.index++
						last = next
						return acc
					}
					const res = form.result(innerAcc)
					innerCtx.index = 0
					innerAcc = form.init()
					innerAcc = form.foldFn(next, innerAcc, innerCtx)
					innerCtx.index++
					last = next
					return foldFn(res, acc, ctx)
				},
				result(acc) {
					if (innerCtx) return result(getResult(acc))
					return result(acc)
				},
			})
		}
	}
}
