export function* range(start: number, end: number, step = 1) {
	for (let i = start; i < end; i += step) {
		yield i
	}
}

export function* loop<T>(cond: (t: T) => unknown, step: (t: T) => T, init: T) {
	for (; cond(init); init = step(init)) {
		yield init
	}
}

export function* until<T>(cond: (t: T) => unknown, step: (t: T) => T, init: T) {
	do {
		init = step(init)
		yield init
	} while (!cond(init))
}

export function* untilFixPoint<T>(step: (t: T) => T, init: T) {
	while (true) {
		yield init
		const next = step(init)
		if (Object.is(next, init)) return
		init = next
	}
}

export function* times<V>(v: V, n: number) {
	for (let i = 0; i < n; i++) {
		yield v
	}
}
