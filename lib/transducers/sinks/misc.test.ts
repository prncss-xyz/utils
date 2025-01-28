import { id } from '@constellar/core'

import { range } from '../../iterators'
import { collect } from '../transductions'
import { arraySinkDest, sumSink } from './misc'

describe('sumForm', () => {
	test('', () => {
		const res = collect(range(0, 4), id)(sumSink())
		expect(res).toEqual(6)
	})
})

describe('arrayForm', () => {
	test('', () => {
		const res = collect(range(0, 4), id)(arraySinkDest())
		expect(res).toEqual([0, 1, 2, 3])
	})
})
