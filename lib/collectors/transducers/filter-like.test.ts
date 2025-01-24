import { eq, lt, modulo } from '../../functions'
import { range } from '../../iterators'
import { collect } from '../core'
import { arrayFormDest } from '../forms'
import {
	drop,
	dropUntil,
	dropWhile,
	dropWith,
	filter,
	take,
	takeUntil,
	takeWhile,
} from './filter-like'

describe('filter', () => {
	test('', () => {
		const res = collect(range(0, 4), filter(modulo(2)))(arrayFormDest())
		expect(res).toEqual([1, 3])
	})
})

describe('take', () => {
	test('', () => {
		const res = collect(range(0, 10), take(4))(arrayFormDest())
		expect(res).toEqual([0, 1, 2, 3])
	})
})
describe('takeWhile', () => {
	test('', () => {
		const res = collect(range(0, 10), takeWhile(lt(3)))(arrayFormDest())
		expect(res).toEqual([0, 1, 2])
	})
})

describe('takeUntil', () => {
	test('', () => {
		const res = collect(range(0, 10), takeUntil(eq(3)))(arrayFormDest())
		expect(res).toEqual([0, 1, 2, 3])
	})
})

describe('drop', () => {
	test('', () => {
		const res = collect(range(0, 7), drop(4))(arrayFormDest())
		expect(res).toEqual([4, 5, 6])
	})
})
describe('dropWhile', () => {
	test('', () => {
		const res = collect(range(0, 7), dropWhile(lt(3)))(arrayFormDest())
		expect(res).toEqual([3, 4, 5, 6])
	})
})

describe('dropUntil', () => {
	test('', () => {
		const res = collect(range(0, 7), dropUntil(eq(3)))(arrayFormDest())
		expect(res).toEqual([4, 5, 6])
	})
})

describe('dropWith', () => {
	test('', () => {
		const res = collect([0, 0, 1, 2, 0, 3, 3, 4], dropWith())(arrayFormDest())
		expect(res).toEqual([0, 1, 2, 0, 3, 4])
	})
})
