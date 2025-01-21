export function* range(start: number, end: number, step = 1) {
	for (let i = start; i < end; i += step) {
		yield i
	}
}

export function* loop<T>(init: T, cond: (t: T) => unknown, step: (t: T) => T) {
	for (; cond(init); init = step(init)) {
		yield init
	}
}
