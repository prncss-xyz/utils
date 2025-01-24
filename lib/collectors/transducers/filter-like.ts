import { ResolvedTransducer, Transducer } from '../core'

export function filter<A, Ctx extends { index: unknown }>(
	cond: (a: A, index: Ctx['index']) => unknown,
): Transducer<Ctx, A, A> {
	return function <S>(p: ResolvedTransducer<S, A, Ctx>) {
		return function ({ foldFn, result }) {
			return p({
				foldFn: (t, acc, ctx) =>
					cond(t, ctx.index) ? foldFn(t, acc, ctx) : acc,
				result,
			})
		}
	}
}

export function take<A, Ctx extends { close: () => void; index: unknown }>(
	n: number,
): Transducer<Ctx, A, A> {
	return function <S>(p: ResolvedTransducer<S, A, Ctx>) {
		return function ({ foldFn, result }) {
			return p({
				foldFn(t, acc, ctx) {
					if (n <= 1) ctx.close()
					if (n === 0) return acc
					n--
					return foldFn(t, acc, ctx)
				},
				result,
			})
		}
	}
}

export function takeWhile<A, Ctx extends { close: () => void; index: unknown }>(
	cond: (a: A, index: Ctx['index']) => unknown,
): Transducer<Ctx, A, A> {
	return function <S>(p: ResolvedTransducer<S, A, Ctx>) {
		return function ({ foldFn, result }) {
			return p({
				foldFn(t, acc, ctx) {
					if (cond(t, ctx.index)) return foldFn(t, acc, ctx)
					ctx.close()
					return acc
				},
				result,
			})
		}
	}
}

// aka find
export function takeUntil<A, Ctx extends { close: () => void; index: unknown }>(
	cond: (a: A, index: Ctx['index']) => unknown,
): Transducer<Ctx, A, A> {
	return function <S>(p: ResolvedTransducer<S, A, Ctx>) {
		return function ({ foldFn, result }) {
			return p({
				foldFn(t, acc, ctx) {
					if (cond(t, ctx.index)) ctx.close()
					return foldFn(t, acc, ctx)
				},
				result,
			})
		}
	}
}

export function drop<A, Ctx extends { close: () => void; index: unknown }>(
	n: number,
): Transducer<Ctx, A, A> {
	return function <S>(p: ResolvedTransducer<S, A, Ctx>) {
		return function ({ foldFn, result }) {
			return p({
				foldFn(t, acc, ctx) {
					if (n > 0) {
						n--
						return acc
					}
					return foldFn(t, acc, ctx)
				},
				result,
			})
		}
	}
}
export function dropWith<A, Ctx extends { close: () => void; index: unknown }>(
	eq: (next: A, last: A, index: Ctx['index']) => unknown = Object.is,
): Transducer<Ctx, A, A> {
	return function <S>(p: ResolvedTransducer<S, A, Ctx>) {
		return function ({ foldFn, result }) {
			let first = true
			let last: A | undefined
			return p({
				foldFn(next, acc, ctx) {
					if (first || last === undefined || !eq(next, last, ctx.index)) {
						acc = foldFn(next, acc, ctx)
					}
					last = next
					first = false
					return acc
				},
				result,
			})
		}
	}
}

export function dropWhile<A, Ctx extends { close: () => void; index: unknown }>(
	cond: (a: A, index: Ctx['index']) => unknown,
): Transducer<Ctx, A, A> {
	return function <S>(p: ResolvedTransducer<S, A, Ctx>) {
		return function ({ foldFn, result }) {
			let open = false
			return p({
				foldFn(t, acc, ctx) {
					open ||= !cond(t, ctx.index)
					if (open) return foldFn(t, acc, ctx)
					return acc
				},
				result,
			})
		}
	}
}

export function dropUntil<A, Ctx extends { close: () => void; index: unknown }>(
	cond: (a: A, index: Ctx['index']) => unknown,
): Transducer<Ctx, A, A> {
	return function <S>(p: ResolvedTransducer<S, A, Ctx>) {
		return function ({ foldFn, result }) {
			let fulfilled = false
			return p({
				foldFn(t, acc, ctx) {
					if (fulfilled) return foldFn(t, acc, ctx)
					if (cond(t, ctx.index)) fulfilled = true
					return acc
				},
				result,
			})
		}
	}
}
