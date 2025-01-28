export interface Source<Value, Index, Acc> {
	init: [Index, Acc]
	step: (index: Index, acc: Acc) => [Value, Index, Acc] | undefined
}

/*
export function observableColl<K, T>(): UnfoldForm<number, number, number> {
	function s(v: [K, T] | undefined) {}
	return {
		init: [0, start],
		step(index: number, acc: number) {
			if (step > 0 ? acc >= end : acc <= start) return undefined
			return [acc, index + 1, acc + step] as const
		},
	}
}
*/

export function arraySource<T>(ts: T[]): Source<T, number, T[]> {
	return {
		init: [0, ts],
		step(index, acc) {
			if (index === acc.length) return undefined
			return [acc[index]!, index + 1, acc]
		},
	}
}

export function rangeSource(
	start: number,
	end: number,
	step = 1,
): Source<number, number, number> {
	return {
		init: [0, start],
		step(index, acc) {
			if (step > 0 ? acc >= end : acc <= start) return undefined
			return [acc, index + 1, acc + step] as const
		},
	}
}

export function loopSource<T>(
	cond: (t: T) => unknown,
	step: (t: T) => T,
	init: T,
): Source<T, number, T> {
	return {
		init: [0, init],
		step(index, acc) {
			if (cond(acc)) return [acc, index + 1, step(acc)]
			return undefined
		},
	}
}

/*
export function loopColl<T>(
	cond: (t: T) => unknown,
	step: (t: T) => T,
	init: T,
): UnfoldForm<T, T, number> {
	let index = 0
	return {
		index,
		init,
		step(acc) {
			acc = step(acc)
			if (cond(acc)) {
				return [acc, acc, index++]
			}
			return undefined
		},
	}
}

export function untilColl<T>(
	cond: (t: T) => unknown,
	step: (t: T) => T,
	init: T,
): UnfoldForm<T, T, number> {
	let done: unknown = false
	let index = 0
	return {
		index,
		init,
		step(acc) {
			if (done) return undefined
			acc = step(acc)
			done = cond(acc)
			return [acc, acc, index++]
		},
	}
}

export function untilFix<T>(
	step: (t: T) => T,
	init: T,
): UnfoldForm<T, T, number> {
	let first = true
	let last: T
	let index = 0
	return {
		index,
		init,
		step(acc) {
			if (!first && last! === acc) return
			last = acc
			acc = step(acc)
			first = false
			return [acc, acc, index++]
		},
	}
}

export function times<T>(value: T, n: number): UnfoldForm<T, void, number> {
	let index = 0
	return {
		index,
		init: void 0,
		step() {
			if (index === n) return undefined
			return [value, void 0, index++]
		},
	}
}

export function iterColl<T>(ts: Iterable<T>): UnfoldForm<T, void, number> {
	const iter = ts[Symbol.iterator]()
	let index = 0
	return {
		index,
		init: void 0,
		step(acc) {
			const { done, value } = iter.next()
			if (done) return undefined
			return [value, acc, index++]
		},
	}
}
*/
