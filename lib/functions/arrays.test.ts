import { insertIndex, removeIndex, replaceIndex } from './arrays'

describe('insert', () => {
	it('inserts an element', () => {
		expect(insertIndex(0, 3)([0, 1, 2])).toEqual([3, 0, 1, 2])
		expect(insertIndex(1, 3)([0, 1, 2])).toEqual([0, 3, 1, 2])
		expect(insertIndex(2, 3)([0, 1, 2])).toEqual([0, 1, 3, 2])
		expect(insertIndex(3, 3)([0, 1, 2])).toEqual([0, 1, 2, 3])
		expect(insertIndex(-1, 3)([0, 1, 2])).toEqual([0, 1, 3, 2])
		expect(insertIndex(3, 3)([0, 1, 2])).toEqual([0, 1, 2, 3])
		expect(insertIndex(4, 3)([0, 1, 2])).toEqual([0, 1, 2])
		expect(insertIndex(-4, 3)([0, 1, 2])).toEqual([0, 1, 2])
	})
})

describe('replace', () => {
	it('replace an element', () => {
		expect(replaceIndex(3, 0)([0, 1, 2])).toEqual([3, 1, 2])
		expect(replaceIndex(3, 1)([0, 1, 2])).toEqual([0, 3, 2])
		expect(replaceIndex(3, 2)([0, 1, 2])).toEqual([0, 1, 3])
		expect(replaceIndex(3, -1)([0, 1, 2])).toEqual([0, 1, 3])
		expect(replaceIndex(3, 3)([0, 1, 2])).toEqual([0, 1, 2])
		expect(replaceIndex(-4, 3)([0, 1, 2])).toEqual([0, 1, 2])
	})
	it('keeps the reference when possible', () => {
		const xs = [0, 1, 2]
		expect(replaceIndex(0, 0)(xs)).toBe(xs)
	})
})

describe('remove', () => {
	it('remove an element', () => {
		expect(removeIndex(0)([0, 1, 2])).toEqual([1, 2])
		expect(removeIndex(1)([0, 1, 2])).toEqual([0, 2])
		expect(removeIndex(2)([0, 1, 2])).toEqual([0, 1])
		expect(removeIndex(-1)([0, 1, 2])).toEqual([0, 1])
		expect(removeIndex(3)([0, 1, 2])).toEqual([0, 1, 2])
		expect(removeIndex(-4)([0, 1, 2])).toEqual([0, 1, 2])
	})
	it('keeps the reference when possible', () => {
		const xs = [0, 1, 2]
		expect(removeIndex(4)(xs)).toBe(xs)
	})
})
