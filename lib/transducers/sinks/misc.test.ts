import { id } from '@constellar/core'

import { add } from '../../functions'
import { range } from '../../iterators'
import { map } from '../operators'
import { collect, collectIndexed } from '../transductions'
import { arraySinkDest, objSink, sumSink } from './misc'

describe('sumSink', () => {
	test('', () => {
		const res = collect(range(0, 4), id)(sumSink())
		expect(res).toEqual(6)
	})
})

describe('arraySinkDest', () => {
	test('', () => {
		const res = collect(range(0, 4), id)(arraySinkDest())
		expect(res).toEqual([0, 1, 2, 3])
	})
})

describe('objSink', () => {
	test('', () => {
		const o = { a: 1, b: 2, c: 3 }
		const res = collectIndexed(Object.entries(o), map(add(1)))(objSink())
		expect(res).toEqual({ a: 2, b: 3, c: 4 })
	})
})
