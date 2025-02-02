import { focus, Focus, isUndefined, PRISM, REMOVE } from '@constellar/core'

import { isoAssert } from './assert'
import { fromInit, Init, neq } from './functions'
import {
	filtered,
	insertSorted,
	symmetricDiff,
} from './functions/arrays'

/*
export function insertValue<X>(element: X) {
	let dirty = true
	function p(x: X) {
		if (Object.is(x, element)) dirty = false
	}
	return function (xs: X[]) {
		xs.forEach(p)
		return dirty ? xs.concat(element) : xs
	}
}
*/

export function removeValue<X>(element: X) {
	return filtered<X>(neq(element))
}

export type NonRemove<T> = T extends typeof REMOVE ? never : T

interface ICategoryEvent<K, V> {
	key: K
	last: undefined | V
	next: undefined | V
}
interface ICategory<K, V> {
	map(key: K, cb: (value: V) => V): void
	subscribe(listener: (event: ICategoryEvent<K, V>) => void): void
}
interface ICategoryPutRemove<K, V> extends ICategory<K, V> {
	put(key: K, value: V): void
	remove(key: K): void
}

export function oneToOne<SValue, TValue, SKey, TKey, Fail, Command>(
	source: ICategory<SKey, SValue>,
	getTargetId: Init<TKey | undefined, [SValue]>,
	target: ICategory<TKey, TValue>,
	o: Focus<SKey, TValue, Fail, NonRemove<Command>, PRISM>,
): (t: TValue) => Fail | SKey
export function oneToOne<SValue, TValue, SKey, TKey, Fail, IS_PRISM>(
	source: ICategory<SKey, SValue>,
	getTargetId: Init<TKey | undefined, [SValue]>,
	target: ICategoryPutRemove<TKey, TValue>,
	o: Focus<SKey, TValue, Fail, typeof REMOVE, IS_PRISM>,
): (t: TValue) => Fail | SKey
export function oneToOne<SValue, TValue, SKey, TKey, Fail, IS_PRISM, Command>(
	source: ICategory<SKey, SValue>,
	getTargetId: Init<TKey | undefined, [SValue]>,
	target: ICategory<TKey, TValue> | ICategoryPutRemove<TKey, TValue>,
	o: Focus<SKey, TValue, Fail, Command, IS_PRISM>,
) {
	const resolved = focus<TValue>()(o)
	function getTargetIdResolved(source: SValue | undefined) {
		if (isUndefined(source)) return undefined
		return fromInit(getTargetId, source)
	}
	source.subscribe((event) => {
		const { key, last, next } = event
		const parentOut = getTargetIdResolved(last)
		const parentIn = getTargetIdResolved(next)
		if (parentIn === parentOut) return
		if (parentOut !== undefined) {
			if (resolved.isCommand(REMOVE))
				target.map(parentOut, resolved.update(REMOVE))
			else {
				isoAssert('remove' in target)
				target.remove(parentOut)
			}
		}
		if (parentIn !== undefined) {
			if (resolved.isCommand(REMOVE)) target.map(parentIn, resolved.update(key))
			else {
				isoAssert('remove' in target)
				target.put(parentIn, resolved.put(key, undefined as any)) // only for prisms
			}
		}
	})
	return resolved.view.bind(resolved)
}

export function oneToIndex<SValue, SKey>(
	source: ICategory<SKey, SValue>,
	getTargetId: (v: SValue) => unknown,
	target: ICategoryPutRemove<SKey, true>,
) {
	function getTargetIdResolved(source: SValue | undefined) {
		if (isUndefined(source)) return undefined
		return getTargetId(source)
	}
	source.subscribe((event) => {
		const { key, last, next } = event
		const parentOut = getTargetIdResolved(last)
		const parentIn = getTargetIdResolved(next)
		if (parentIn === parentOut) return
		if (parentIn) target.put(key, true)
		else target.remove(key)
	})
	return getTargetId
}

// FIXME: does it makes sense
export function manyToOne<SValue, TValue, SKey, TKey, Fail, Command>(
	source: ICategory<SKey, SValue>,
	getTargetIds: Init<TKey[], [SValue]>,
	target: ICategory<TKey, TValue> | ICategoryPutRemove<TKey, TValue>,
	o: Focus<SKey, TValue, Fail, NonRemove<Command>, PRISM>,
): (t: TValue) => Fail | SKey
export function manyToOne<SValue, TValue, SKey, TKey, Fail, IS_PRISM>(
	source: ICategory<SKey, SValue>,
	getTargetIds: Init<TKey[], [SValue]>,
	target: ICategory<TKey, TValue> | ICategoryPutRemove<TKey, TValue>,
	o: Focus<SKey, TValue, Fail, typeof REMOVE, IS_PRISM>,
): (t: TValue) => Fail | SKey
export function manyToOne<SValue, TValue, SKey, TKey, Fail, IS_PRISM, Command>(
	source: ICategory<SKey, SValue>,
	getTargetIds: Init<TKey[], [SValue]>,
	target: ICategory<TKey, TValue> | ICategoryPutRemove<TKey, TValue>,
	o: Focus<SKey, TValue, Fail, Command, IS_PRISM>,
) {
	const resolved = focus<TValue>()(o)
	function getTargetIdsResolved(source: SValue | undefined) {
		if (isUndefined(source)) return []
		return fromInit(getTargetIds, source)
	}
	source.subscribe((event) => {
		const { key, last, next } = event
		const [parentsOut, parentsIn] = symmetricDiff(
			getTargetIdsResolved(last),
			getTargetIdsResolved(next),
		)
		parentsOut.forEach((parentOut) => {
			if (resolved.isCommand(REMOVE))
				target.map(parentOut, resolved.update(REMOVE))
			else {
				isoAssert('remove' in target)
				target.remove(parentOut)
			}
		})
		parentsIn.forEach((parentIn) => {
			if (resolved.isCommand(REMOVE)) target.map(parentIn, resolved.update(key))
			else {
				isoAssert('remove' in target)
				target.put(parentIn, resolved.put(key, undefined as any)) // only for prisms
			}
		})
	})
	return resolved.view.bind(resolved)
}

export function manyToMany<SValue, TValue, SKey, TKey, Fail, Command, IS_PRISM>(
	source: ICategory<SKey, SValue>,
	getTargetIds: Init<TKey[], [SValue]>,
	target: ICategory<TKey, TValue>,
	o: Focus<SKey[], TValue, Fail, Command, IS_PRISM>,
) {
	const resolved = focus<TValue>()(o)
	function getTargetIdsResolved(source: SValue | undefined) {
		if (isUndefined(source)) return []
		return fromInit(getTargetIds, source)
	}
	source.subscribe((event) => {
		const { key, last, next } = event
		const [parentsOut, parentsIn] = symmetricDiff(
			getTargetIdsResolved(last),
			getTargetIdsResolved(next),
		)
		parentsOut.forEach((parentOut) =>
			target.map(parentOut, resolved.update(removeValue(key))),
		)
		parentsIn.forEach((parentIn) =>
			target.map(parentIn, resolved.update(insertSorted(key))),
		)
	})
	return resolved.view.bind(resolved)
}

export function oneToMany<SValue, TValue, SKey, TKey, Fail, Command, IS_PRISM>(
	source: ICategory<SKey, SValue>,
	getTargetId: Init<TKey | undefined, [SValue]>,
	target: ICategory<TKey, TValue>,
	o: Focus<SKey[], TValue, Fail, Command, IS_PRISM>,
) {
	const resolved = focus<TValue>()(o)
	function getTargetIdResolved(source: SValue | undefined) {
		if (isUndefined(source)) return undefined
		return fromInit(getTargetId, source)
	}
	source.subscribe((event) => {
		const { key, last, next } = event
		const parentOut = getTargetIdResolved(last)
		const parentIn = getTargetIdResolved(next)
		if (parentIn === parentOut) return
		if (parentOut !== undefined)
			target.map(parentOut, resolved.update(removeValue(key)))
		if (parentIn !== undefined)
			target.map(parentIn, resolved.update(insertValue(key)))
	})
	return resolved.view.bind(resolved)
}
