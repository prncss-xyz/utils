import { id } from '@constellar/core'

import { always } from '../../functions'
import { FoldForm } from '../core'

export function valueForm<T, Ctx>(): FoldForm<
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

export function arrayFormDest<T, Ctx>(): FoldForm<T, T[], T[], Ctx> {
	return {
		foldFn: (t, acc) => (acc.push(t), acc),
		init: () => [],
		result: id,
	}
}

export function arrayForm<T, Ctx>(): FoldForm<T, T[], T[], Ctx> {
	return {
		foldFn: (t, acc) => [...acc, t],
		init: () => [],
		result: id,
	}
}

export function sumForm<Ctx>(): FoldForm<number, number, number, Ctx> {
	return {
		foldFn: (t, acc) => acc + t,
		init: () => 0,
		result: id,
	}
}

export function productForm<Ctx>(): FoldForm<number, number, number, Ctx> {
	return {
		foldFn: (t, acc) => acc * t,
		init: () => 1,
		result: id,
	}
}

export function lengthForm<Ctx>(): FoldForm<unknown, number, number, Ctx> {
	return {
		foldFn: (_t, acc) => acc + 1,
		init: () => 0,
		result: id,
	}
}

export function groupByForm<P extends PropertyKey, T, Ctx>(
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

export function partitionForm<T, Ctx>(predicate: (t: T) => unknown) {
	return groupByForm<'false' | 'true', T, Ctx>((t: T) =>
		predicate(t) ? 'true' : 'false',
	)
}

export function joinForm<Ctx>(
	sep = '\t',
): FoldForm<string, string, string, Ctx> {
	return {
		foldFn: (t, acc) => (acc === '' ? t : acc + sep + t),
		init: () => '',
		result: id,
	}
}

export function joinLastForm<Ctx>(
	sep = '\n',
): FoldForm<string, string, string, Ctx> {
	return {
		foldFn: (t, acc) => acc + t + sep,
		init: () => '',
		result: id,
	}
}
