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

export function* unfold<T, Acc>({
	init,
	step,
}: {
	init: Acc
	step: (acc: Acc) => [T, Acc] | undefined
}) {
	while (true) {
		const next = step(init)
		if (next === undefined) return
		const [value, acc] = next
		init = acc
		yield value
	}
}

export function* times<V>(v: V, n: number) {
	for (let i = 0; i < n; i++) {
		yield v
	}
}

// could be transducers

/** applies a list of functions to an list of values */
export function ap<A, B>(...fns: ((a: A) => B)[]) {
	return function* (value: Iterable<A>) {
		for (const v of value) {
			for (const fn of fns) {
				yield fn(v)
			}
		}
	}
}

export function groupWith<T>(eq: (a: T, b: T) => unknown) {
	return function* (iterable: Iterable<T>) {
		let group: T[] = []
		let last: T | undefined
		for (const next of iterable) {
			if (last === undefined || eq(last, next)) {
				group.push(next)
			} else {
				yield group
				group = [next]
			}
			last = next
		}
		if (group.length > 0) {
			yield group
		}
	}
}
