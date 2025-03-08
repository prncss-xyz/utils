import {
	filtered,
	filteredValue,
	fromIndex,
	included,
	insert,
	insertCmp,
	join,
	remove,
	replace,
	sorted,
} from './arrays'
import { lt } from './elementary'

describe('insertCmp', () => {
	it('inserts an element', () => {
		expect(insertCmp()(0)([1, 3])).toEqual([0, 1, 3])
		expect(insertCmp()(1)([1, 3])).toEqual([1, 3])
		expect(insertCmp()(2)([1, 3])).toEqual([1, 2, 3])
		expect(insertCmp()(4)([1, 3])).toEqual([1, 3, 4])
	})
})

describe('insert', () => {
	it('inserts an element', () => {
		expect(insert(0, 3)([0, 1, 2])).toEqual([3, 0, 1, 2])
		expect(insert(1, 3)([0, 1, 2])).toEqual([0, 3, 1, 2])
		expect(insert(2, 3)([0, 1, 2])).toEqual([0, 1, 3, 2])
		expect(insert(3, 3)([0, 1, 2])).toEqual([0, 1, 2, 3])
		expect(insert(-1, 3)([0, 1, 2])).toEqual([0, 1, 3, 2])
		expect(insert(3, 3)([0, 1, 2])).toEqual([0, 1, 2, 3])
		expect(insert(4, 3)([0, 1, 2])).toEqual([0, 1, 2])
		expect(insert(-4, 3)([0, 1, 2])).toEqual([0, 1, 2])
	})
})

describe('replace', () => {
	it('replace an element', () => {
		expect(replace(3, 0)([0, 1, 2])).toEqual([3, 1, 2])
		expect(replace(3, 1)([0, 1, 2])).toEqual([0, 3, 2])
		expect(replace(3, 2)([0, 1, 2])).toEqual([0, 1, 3])
		expect(replace(3, -1)([0, 1, 2])).toEqual([0, 1, 3])
		expect(replace(3, 3)([0, 1, 2])).toEqual([0, 1, 2])
		expect(replace(-4, 3)([0, 1, 2])).toEqual([0, 1, 2])
	})
	it('keeps the reference when possible', () => {
		const xs = [0, 1, 2]
		expect(replace(0, 0)(xs)).toBe(xs)
	})
})

describe('remove', () => {
	it('remove an element', () => {
		expect(remove(0)([0, 1, 2])).toEqual([1, 2])
		expect(remove(1)([0, 1, 2])).toEqual([0, 2])
		expect(remove(2)([0, 1, 2])).toEqual([0, 1])
		expect(remove(-1)([0, 1, 2])).toEqual([0, 1])
		expect(remove(3)([0, 1, 2])).toEqual([0, 1, 2])
		expect(remove(-4)([0, 1, 2])).toEqual([0, 1, 2])
	})
	it('keeps the reference when possible', () => {
		const xs = [0, 1, 2]
		expect(remove(4)(xs)).toBe(xs)
	})
})

describe('filtered', () => {
	it('filters an array', () => {
		expect(filtered(lt(2))([1, 2, 0, 4])).toEqual([1, 0])
		expect(filtered(lt(2))([2])).toEqual([])
		const xs = [1]
		expect(filtered(lt(2))(xs)).toBe(xs)
	})
})

describe('filteredValue', () => {
	it('removes a value', () => {
		expect(filteredValue(0)([1, 2, 0, 4])).toEqual([1, 2, 4])
		expect(filteredValue(0)([0])).toEqual([])
		const xs = [1]
		expect(filteredValue(0)(xs)).toBe(xs)
	})
})

describe('description', () => {
	test('', () => {
		expect(fromIndex(-1)([2, 3])).toBe(3)
	})
})

describe('sorted', () => {
	test('', () => {
		expect(sorted()([3, 2])).toEqual([2, 3])
	})
})

describe('join', () => {
	test('', () => {
		expect(join()([2, 3])).toEqual('2,3')
	})
})

describe('included', () => {
	test('', () => {
		expect(included([2, 3])(2)).toBeTruthy()
		expect(included([2, 3])(0)).toBeFalsy()
	})
})
