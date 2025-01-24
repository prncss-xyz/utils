import { pipe } from '@constellar/core'

import { add, mul, sub } from '../../functions'
import { range, times } from '../../iterators'
import { collect } from '../collectables/iterables'
import { arrayFormDest } from '../forms'
import { ap, map } from './map-like'

describe('map', () => {
	test('simple', () => {
		const res = collect(range(0, 4), map(mul(2)))(arrayFormDest())
		expect(res).toEqual([0, 2, 4, 6])
	})
	test('index', () => {
		const res = collect(
			times(1, 4),
			map((x, index) => index + x),
		)(arrayFormDest())
		expect(res).toEqual([1, 2, 3, 4])
	})
	test('composed', () => {
		const res = collect(
			['a', 'bb', 'ccc'],
			pipe(
				map((x) => x.length),
				map(mul(2)),
			),
		)(arrayFormDest())
		expect(res).toEqual([2, 4, 6])
	})
})

describe('ap', () => {
	test('', () => {
		const res = collect(range(0, 3), ap(sub(1), add(1)))(arrayFormDest())
		expect(res).toEqual([-1, 1, 0, 2, 1, 3])
	})
})
