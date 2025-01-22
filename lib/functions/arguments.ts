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
type Curry<Args extends unknown[], Res> = {
	(...p: Args): Res
	<PS extends Pre<Args>>(...p: PS): Curry<Rest<PS, Args>, Res>
}

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

export function bindWith<
	Method extends PropertyKey,
	Obj extends { [Key in Method]: (...args: any) => unknown },
>(obj: Obj, method: Method, n?: number) {
	const bound = obj[method].bind(obj)
	return curry(function (
		...args: Parameters<Obj[Method]>
	): ReturnType<Obj[Method]> {
		return bound(...args) as any
	}, n ?? bound.length)
}

export function flip<A, B, Args extends any[], R>(
	f: (a: A, b: B, ...args: Args) => R,
	n = f.length,
) {
	return curry(function (b: B, a: A, ...args: Args) {
		return f(a, b, ...args)
	}, n)
}
