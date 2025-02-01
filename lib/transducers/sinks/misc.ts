import { id } from '@constellar/core'

import { always } from '../../functions'
import { FoldForm } from '../transductions'
import { shuffledAdd } from './internal'

export function forEachSink<T, Ctx>(
	cb: (v: T) => void,
): FoldForm<T, void, void, Ctx> {
	return {
		foldFn: cb,
		init: always(undefined),
		result: id,
	}
}

export function valueSink<T, Ctx>(): FoldForm<
	T,
	T | undefined,
	T | undefined,
	Ctx
> {
	return {
		foldFn: id,
		init: always(undefined),
		result: id,
	}
}

export function voidSink<T, Ctx>(): FoldForm<T, void, void, Ctx> {
	return {
		foldFn: always(undefined),
		init: always(undefined),
		result: id,
	}
}

export function objSink<T, Index extends PropertyKey, Ctx>(): FoldForm<
	T,
	Record<Index, T>,
	Record<Index, T>,
	Ctx & { index: Index }
> {
	return {
		foldFn: (t, acc, ctx) => ((acc[ctx.index] = t), acc),
		init: () => ({}) as any,
		result: id,
	}
}

export function arraySinkDest<T, Ctx>(): FoldForm<T, T[], T[], Ctx> {
	return {
		foldFn: (t, acc) => (acc.push(t), acc),
		init: () => [],
		result: id,
	}
}

export function arraySink<T, Ctx>(): FoldForm<T, T[], T[], Ctx> {
	return {
		foldFn: (t, acc) => [...acc, t],
		init: () => [],
		result: id,
	}
}

export function sumSink<Ctx>(): FoldForm<number, number, number, Ctx> {
	return {
		foldFn: (t, acc) => acc + t,
		init: () => 0,
		result: id,
	}
}

export function productSink<Ctx>(): FoldForm<number, number, number, Ctx> {
	return {
		foldFn: (t, acc) => acc * t,
		init: () => 1,
		result: id,
	}
}

export function lengthSink<Ctx>(): FoldForm<unknown, number, number, Ctx> {
	return {
		foldFn: (_t, acc) => acc + 1,
		init: () => 0,
		result: id,
	}
}

export function groupBySink<P extends PropertyKey, T, Ctx>(
	keyFn: (t: T) => P | undefined,
): FoldForm<T, Record<P, T[]>, Record<P, T[]>, Ctx> {
	const groups = {} as Record<P, T[]>
	return {
		foldFn: (t: T) => {
			const key = keyFn(t)
			if (key !== undefined) {
				if (groups[key] === undefined) {
					groups[key] = []
				}
				groups[key].push(t)
			}
			return groups
		},
		init: () => groups,
		result: id,
	}
}

export function partitionSink<T, Ctx>(predicate: (t: T) => unknown) {
	return groupBySink<'false' | 'true', T, Ctx>((t: T) =>
		predicate(t) ? 'true' : 'false',
	)
}

export function joinSink<Ctx>(
	sep = '\t',
): FoldForm<string, string, string, Ctx> {
	return {
		foldFn: (t, acc) => (acc === '' ? t : acc + sep + t),
		init: () => '',
		result: id,
	}
}

export function joinLastSink<Ctx>(
	sep = '\n',
): FoldForm<string, string, string, Ctx> {
	return {
		foldFn: (t, acc) => acc + t + sep,
		init: () => '',
		result: id,
	}
}

export function shuffledSink<T>() {
	return {
		foldFn: shuffledAdd(),
		init: () => [] as T[],
		result: id<T[]>,
	}
}
