import { sortedAdd } from "./internal"

function cmp0<T>(a: T, b: T): number {
	return a < b ? -1 : a > b ? 1 : 0
}

export function maxForm<T>(cmp = cmp0<T>) {
	return {
		foldFn: (t: T, acc: T | undefined) =>
			acc === undefined || cmp(t, acc) > 0 ? t : acc,
		init: () => undefined,
	}
}

export function minForm<T>(cmp = cmp0<T>) {
	return {
		foldFn: (t: T, acc: T | undefined) =>
			acc === undefined || cmp(t, acc) < 0 ? t : acc,
		init: () => undefined,
	}
}

export function sortedForm<T>(cmp = cmp0<T>) {
	return {
		foldFn: sortedAdd(cmp),
		init: () => [],
	}
}

