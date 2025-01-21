import { isFunction } from '@constellar/core'

export type Init<Res, Args extends any[] = []> = ((...args: Args) => Res) | Res

export function fromInit<Res, Args extends any[] = []>(
	init: Init<Res, Args>,
	...args: Args
): Res {
	return isFunction(init) ? init(...args) : init
}

export function bindMethod<
	Method extends PropertyKey,
	Obj extends { [Key in Method]: (...args: any) => unknown },
>(obj: Obj, method: Method) {
	return function (...args: Parameters<Obj[Method]>): ReturnType<Obj[Method]> {
		return obj[method](...args) as any
	}
}

export function curry<Arg0, Args extends unknown[], Res>(
	f: (args0: Arg0, ...args: Args) => Res,
) {
	return function (arg0: Arg0) {
		return function (...args: Args) {
			return f(arg0, ...args)
		}
	}
}
export function converge<R, Branches extends unknown[], Args extends unknown[]>(
	converger: (...branches: Branches) => R,
	branches: unknown[] & { [K in number]: (...args: Args) => Branches[K] },
) {
	return function (...args: Args) {
		converger(...(branches.map((branch: any) => branch(...args)) as any))
	}
}

export function asyncUpdater<Value>(
	up:
		| ((last: undefined | Value) => Promise<undefined | Value>)
		| undefined
		| Value,
) {
	return async function (last: undefined | Value) {
		return isFunction(up) ? ((await up(last)) as undefined | Value) : up
	}
}

export const mul = curry((a: number, b: number) => b * a)
export const div = curry((a: number, b: number) => b / a)
export function add(a = 1) {
	return function (b: number) {
		return b + a
	}
}
export function sub(a = 1) {
	return function (b: number) {
		return b - a
	}
}
export function lt(a = 0) {
	return function (b: number) {
		return b < a
	}
}
export function lte(a = 0) {
	return function (b: number) {
		return b <= a
	}
}
export function gt(a = 0) {
	return function (b: number) {
		return b > a
	}
}
export function gte(a = 0) {
	return function (b: number) {
		return b >= a
	}
}
export function constant<T>(a: T) {
	return function () {
		return a
	}
}
export function not(a: unknown) {
	return !a
}
