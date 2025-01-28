import { Source } from '../sources'
import { BaseCtx, ResolvedTransducer, Transducer } from '../transductions'

// TODO: transduce branches
// TODO: zipObj

export function zip<A, B, Acc, Index, Ctx extends BaseCtx<unknown, unknown>>(
	unfold: Source<B, Acc, Index>,
): Transducer<Ctx, A, [A, B]> {
	return function <S>(p: ResolvedTransducer<S, A, Ctx>) {
		return function ({ foldFn, result }) {
			let [unAcc, index] = unfold.init
			let value: B
			return p({
				foldFn(a, acc, ctx) {
					const r = unfold.step(unAcc, index)
					if (r === undefined) {
						ctx.close()
						return acc
					}
					;[value, unAcc, index] = r
					return foldFn([a, value], acc, ctx)
				},
				result,
			})
		}
	}
}

export function zipCmp<A, B, Acc, Index, Ctx extends BaseCtx<unknown, unknown>>(
	unfold: Source<B, Acc, Index>,
	cmp: (a: A, b: B) => number,
): Transducer<Ctx, A, [A | undefined, B | undefined]> {
	return function <S>(p: ResolvedTransducer<S, A, Ctx>) {
		return function ({ foldFn, result }) {
			let [unAcc, index] = unfold.init
			let r = unfold.step(unAcc, index)
			let value: B
			return p({
				foldFn(a, acc, ctx) {
					while (true) {
						if (r === undefined) {
							return foldFn([a, undefined], acc, ctx)
						}
						;[value, unAcc, index] = r
						if (cmp(a, value) > 0) {
							return foldFn([a, undefined], acc, ctx)
						}
						if (cmp(a, value) === 0) {
							acc = foldFn([a, value], acc, ctx)
							r = unfold.step(unAcc, index)
							return acc
						}
						acc = foldFn([undefined, value], acc, ctx)
						r = unfold.step(unAcc, index)
					}
				},
				result(acc, ctx) {
					let value: B
					while (true) {
						if (r === undefined) break
						;[value, unAcc, index] = r
						const innerCtx = { ...ctx, index, unAcc }
						acc = foldFn([undefined, value], acc, innerCtx)
						r = unfold.step(unAcc, index)
					}
					return result(acc, ctx)
				},
			})
		}
	}
}

export function concat<A, Ctx, Index extends BaseCtx<Index, Acc>, B, Acc>(
	unfold: Source<B, Acc, Index>,
): Transducer<Ctx, A, A | B> {
	return function <S>(p: ResolvedTransducer<S, A, Ctx>) {
		return function ({ foldFn, result }) {
			return p({
				foldFn,
				result(acc, ctx) {
					let [unAcc, index] = unfold.init
					let value: B
					while (true) {
						const r = unfold.step(unAcc, index)
						if (r === undefined) break
						;[value, unAcc, index] = r
						const innerCtx = { ...ctx, index, unAcc }
						acc = foldFn(value, acc, innerCtx)
					}
					return result(acc, ctx)
				},
			})
		}
	}
}
