import { id } from '@constellar/core'

import { range } from '../../iterators'
import { collect } from '../collectables/iterables'
import { arrayFormDest, sumForm } from './misc'

describe('sumForm', () => {
	test('', () => {
		const res = collect(range(0, 4), id)(sumForm())
		expect(res).toEqual(6)
	})
})

describe('arrayForm', () => {
	test('', () => {
		const res = collect(range(0, 4), id)(arrayFormDest())
		expect(res).toEqual([0, 1, 2, 3])
	})
})
