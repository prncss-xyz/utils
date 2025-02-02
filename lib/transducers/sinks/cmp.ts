import { id } from '@constellar/core'

import { cmp0 } from '../../internal'
import { sortedAdd } from './internal'

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
