import { id } from '@constellar/core'

import { sortedAdd } from './internal'

function cmp0<T>(a: T, b: T): number {
	return a < b ? -1 : a > b ? 1 : 0
}

export function maxSink<T>(cmp = cmp0<T>) {
	return {
		foldFn: (t: T, acc: T | undefined) =>
			acc === undefined || cmp(t, acc) > 0 ? t : acc,
		init: () => undefined as T | undefined,
		result: id<T | undefined>,
	}
}

export function minSink<T>(cmp = cmp0<T>) {
	return {
		foldFn: (t: T, acc: T | undefined) =>
			acc === undefined || cmp(t, acc) < 0 ? t : acc,
		init: () => undefined as T | undefined,
		result: id<T | undefined>,
	}
}

export function sortedSink<T>(cmp = cmp0<T>) {
	return {
		foldFn: sortedAdd(cmp),
		init: () => [] as T[],
		result: id<T[]>,
	}
}
