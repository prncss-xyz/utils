import { pipe } from '@constellar/core'

import { range } from '../../iterators'
import { collect } from '../core'
import { arrayForm } from '../forms'
import { chain, flatten } from './chain-like'
import { map } from './map-like'

describe('chain', () => {
	test('simple', () => {
		const res = collect(
			range(0, 4),
			chain((x) => [x, x * 2]),
		)(arrayForm())
		expect(res).toEqual([0, 0, 1, 2, 2, 4, 3, 6])
	})
})

describe('flatten', () => {
	test('simple', () => {
		const res = collect(
			range(0, 4),
			pipe(
				map((x) => [x, x]),
				flatten(),
			),
		)(arrayForm())
		expect(res).toEqual([0, 0, 1, 1, 2, 2, 3, 3])
	})
})
