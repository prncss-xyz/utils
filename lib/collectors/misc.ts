import { id } from '@constellar/core'

export function arrayForm<T>() {
	return {
		foldFn: (t: T, acc: T[]) => (acc.push(t), acc),
		init: () => [],
	}
}

export function valueForm<T>() {
	return {
		foldFn: id<T | undefined>,
		init: () => undefined,
	}
}

export function sumForm() {
	return {
		foldFn: (t: number, acc: number) => acc + t,
		init: () => 0,
	}
}

export function joinForm(sep = '\t') {
	return {
		foldFn: (t: string, acc: string) => (acc === '' ? t : acc + sep + t),
		init: () => '',
	}
}

export function joinLastForm(sep = '\n') {
	return {
		foldFn: (t: string, acc: string) => acc + t + sep,
		init: () => '',
	}
}

export function productForm() {
	return {
		foldFn: (t: number, acc: number) => acc * t,
		init: () => 1,
	}
}

export function lengthForm() {
	return {
		foldFn: (_t: unknown, acc: number) => acc + 1,
		init: () => 0,
	}
}

export function partitionForm<T>(predicate: (t: T) => unknown) {
	return groupByForm((t: T) => (predicate(t) ? 'true' : 'false'))
}

export function groupByForm<P extends PropertyKey, T>(
	keyFn: (t: T) => P | undefined,
) {
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
	}
}
