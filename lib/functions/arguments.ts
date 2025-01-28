import { isFunction } from '@constellar/core'

export type Init<Res, Args extends any[] = []> = ((...args: Args) => Res) | Res

export function fromInit<Res, Args extends any[] = []>(
	init: Init<Res, Args>,
	...args: Args
): Res {
	return isFunction(init) ? init(...args) : init
}

type Pre<Args, Acc extends unknown[] = []> = Args extends [
	infer T,
	...infer Rest,
]
	? [...Acc, T] | Pre<Rest, [...Acc, T]>
	: never
type Rest<P extends unknown[], Q extends unknown[]> = P extends [
	infer T,
	...infer R,
]
	? Q extends [infer U, ...infer S]
		? T extends U
			? Rest<R, S>
			: never
		: never
	: Q
export type Curry<Args extends unknown[], Res> = {
	<PS extends Pre<Args>>(...p: PS): Curry<Rest<PS, Args>, Res>
	(...p: Args): Res
}

/**
 * Curry a function. If the function has optional or variadic arguments, you need to specify the number of arguments through the `n` parameter.
 * Will not preserve the type of generic functions.
 */
export function curry<Args extends unknown[], Res>(
	f: (...args: Args) => Res,
	n = f.length,
): Curry<Args, Res> {
	return function <PS extends Pre<Args>>(...p: PS) {
		if (p.length >= n) {
			return (f as any)(...p)
		}
		return curry(function (...q) {
			return (f as any)(...p, ...q)
		}, n - p.length)
	}
}

type Curried<F = unknown> = ((...args: any[]) => F) | F
type UncurriedRes<F> = F extends (...a: any[]) => infer R ? UncurriedRes<R> : F
type UncurriedArgs<F, Acc extends any[] = []> = F extends (
	...args: infer A
) => infer R
	? UncurriedArgs<R, [...Acc, ...A]>
	: Acc

export function uncurry<F extends Curried>(f: F) {
	return function (...args: UncurriedArgs<F>): UncurriedRes<F> {
		while (true) {
			if (!isFunction(f)) return f as any
			const as = args.slice(0, (f as any).length)
			args = args.slice((f as any).length) as any
			f = (f as any)(...as)
			if (args.length === 0) {
				return f as any
			}
		}
	}
}

export function flip<A, B, Args extends any[], R>(
	f: (a: A, b: B, ...args: Args) => R,
	n = f.length,
) {
	return curry(function (b: B, a: A, ...args: Args) {
		return f(a, b, ...args)
	}, n)
}
