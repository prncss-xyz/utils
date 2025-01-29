import { curry } from './arguments'

export const getFixPoint = curry(function <T>(step: (t: T) => T, init: T) {
	while (true) {
		const next = step(init)
		if (Object.is(next, init)) return init
		init = next
	}
})

export const getUntil = curry(function <T>(
	cond: (t: T) => unknown,
	step: (t: T) => T,
	init: T,
) {
	do {
		init = step(init)
	} while (!cond(init))
})

export function tap<T>(fn: (t: T) => unknown, t: T): T {
	fn(t)
	return t
}
