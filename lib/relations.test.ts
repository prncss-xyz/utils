import { focus, id } from '@constellar/core'

import { fromInit, Init, not } from './functions'
import {
	ICategoryEvent,
	ICategoryPutRemove,
	manyToMany,
	oneToIndex,
	oneToMany,
    oneToOne,
} from './relations'

function mapCategory<K, V>(init: Init<V, []> | undefined = undefined) {
	return new MapCategory<K, V>(init)
}

class MapCategory<K, V> implements ICategoryPutRemove<K, V> {
	public contents = new Map<K, V>()
	private subscriptions = new Set<(event: ICategoryEvent<K, V>) => void>()
	constructor(private init: Init<V, []> | undefined = undefined) {}
	get(key: K) {
		return this.contents.get(key) ?? fromInit(this.init)
	}
	map(key: K, cb: (value: V) => V) {
		const last = this.get(key)
		if (last === undefined) return
		const next = cb(last)
		this.contents.set(key, next)
		this.subscriptions.forEach((cb) => cb({ key, last, next }))
	}
	put(key: K, next: V) {
		const last = this.contents.get(key)
		this.contents.set(key, next)
		this.subscriptions.forEach((cb) => cb({ key, last, next }))
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

describe('manyToMany', () => {
	const source = mapCategory<number, string[]>()
	const index = mapCategory<string, number[]>(() => [])
	manyToMany(source, id, index, id)
	it('should work', () => {
		expect(Array.from(index.contents.entries())).toEqual([])
		source.put(1, ['a', 'b'])
		expect(index.get('a')).toEqual([1])
		expect(index.get('b')).toEqual([1])
		source.put(2, ['a'])
		expect(index.get('a')).toEqual([1, 2])
		expect(index.get('b')).toEqual([1])
		source.remove(1)
		expect(index.get('a')).toEqual([2])
		expect(index.get('b')).toEqual([])
		source.remove(2)
		expect(index.get('a')).toEqual([])
		expect(index.get('b')).toEqual([])
	})
})

describe('oneToMany', () => {
	const source = mapCategory<number, string>()
	const index = mapCategory<string, number[]>(() => [])
	oneToMany(source, id, index, id)
	it('should work', () => {
		expect(Array.from(index.contents.entries())).toEqual([])
		source.put(1, 'a')
		expect(index.get('a')).toEqual([1])
		source.put(2, 'a')
		expect(index.get('a')).toEqual([1, 2])
		source.remove(1)
    expect(index.get('a')).toEqual([2])
    source.remove(2)
		expect(index.get('a')).toEqual([])
	})
})
