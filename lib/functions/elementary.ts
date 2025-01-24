import { curry } from './arguments'

export const mul = curry((a: number, b: number) => b * a)
export const div = curry((a: number, b: number) => b / a)
export const add = curry((a: number, b: number) => b + a)
export const sub = curry((a: number, b: number) => b - a)
export const lt = curry((a: number, b: number) => b < a)
export const lte = curry((a: number, b: number) => b <= a)
export const gt = curry((a: number, b: number) => b > a)
export const gte = curry((a: number, b: number) => b >= a)
export const eq = curry((a: number, b: number) => Object.is(b, a))
export const neq = curry((a: number, b: number) => !Object.is(b, a))
export const and = curry((a: unknown, b: unknown) => b && a)
export const or = curry((a: unknown, b: undefined) => b || a)
export const xor = curry((a: unknown, b: unknown) => (b && !a) || (!b && a))
export const iDiv = curry((a: number, b: number) => Math.floor(b / a))
export function always<T>(a: T) {
	return function () {
		return a
	}
}
export function not(a: unknown) {
	return !a
}

// math behavior
export const modulo = curry((a: number, b: number) => {
	if (b < 0) return a + (b % a)
	return b % a
})

export const clamp = curry((min: number, max: number, source: number) => {
	return Math.max(Math.min(source, max), min)
})

export function tuple<const Args extends unknown[]>(...args: Args) {
	return args
}

export function eqWith<A, B>(m: (a: A) => B) {
	return function (a: A, b: A) {
		return Object.is(m(a), m(b))
	}
}
