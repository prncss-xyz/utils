import { mul } from './elementary'
import { fromProp, invert, invertMulti, merge, objMap } from './objects'

describe('merge', () => {
	test('1 object', () => {
		expect(merge({ a: 1 })).toEqual({ a: 1 })
	})
	test('2 objects', () => {
		expect(
			merge({ a: 3, b: [1], c: { a: 1 }, d: 1 }, { a: 4, b: [2], c: { a: 2 } }),
		).toEqual({
			a: 4,
			b: [1, 2],
			c: { a: 2 },
			d: 1,
		})
	})
})

describe('invert', () => {
	test('', () => {
		expect(invert({ a: 1, b: 2, c: 2 })).toEqual({ 1: 'a', 2: 'c' })
	})
})

describe('invertMulti', () => {
	test('', () => {
		expect(invertMulti({ a: 1, b: 2, c: 2 })).toEqual({
			1: ['a'],
			2: ['b', 'c'],
		})
	})
})

describe('objMap', () => {
	test('', () => {
		expect(objMap(mul(2))({ a: 1, b: 2, c: 2 })).toEqual({ a: 2, b: 4, c: 4 })
	})
})

interface O {
	a: number
	b: number
	c?: number
}

describe('fromProp', () => {
	test('', () => {
		const o: O = { a: 1, b: 2, c: 3 }
		expect(fromProp('c')(o)).toEqual(3)
	})
})
