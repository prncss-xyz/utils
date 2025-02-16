import { id } from '@constellar/core'

import { not } from './functions'
import { ICategoryEvent, ICategoryPutRemove, oneToIndex } from './relations'

function mapCategory<K, V>() {
	return new MapCategory<K, V>()
}

class MapCategory<K, V> implements ICategoryPutRemove<K, V> {
	public contents = new Map<K, V>()
	private subscriptions = new Set<(event: ICategoryEvent<K, V>) => void>()
	constructor() {}
	map(key: K, cb: (value: V) => V) {
		const last = this.contents.get(key)
		if (last === undefined) return
		const value = cb(last)
		this.contents.set(key, value)
		this.subscriptions.forEach((cb) => cb({ key, last, next: value }))
	}
	put(key: K, value: V) {
		const last = this.contents.get(key)
		this.contents.set(key, value)
		this.subscriptions.forEach((cb) => cb({ key, last, next: value }))
	}
	remove(key: K) {
		const last = this.contents.get(key)
		this.contents.delete(key)
		this.subscriptions.forEach((cb) => cb({ key, last, next: undefined }))
	}
	subscribe(listener: (event: ICategoryEvent<K, V>) => void) {
		this.subscriptions.add(listener)
		return () => this.subscriptions.delete(listener)
	}
}

describe('oneToIndex', () => {
	const numbers = mapCategory<number, boolean>()
	const truthy = mapCategory<number, true>()
	oneToIndex(numbers, id, truthy)
	it('should work', () => {
		expect(Array.from(numbers.contents.values())).toEqual([])
		expect(Array.from(truthy.contents.keys())).toEqual([])
		numbers.put(1, true)
		numbers.put(2, false)
		numbers.put(3, true)
		// creation
		expect(Array.from(truthy.contents.keys())).toEqual([1, 3])
		// deletion
		numbers.remove(3)
		expect(Array.from(truthy.contents.keys())).toEqual([1])
		// modification
		numbers.map(1, not)
		expect(Array.from(truthy.contents.keys())).toEqual([])
		numbers.map(1, not)
		expect(Array.from(truthy.contents.keys())).toEqual([1])
	})
})
