import { arrayFormDest } from '../forms'
import { collectIndexed } from './indexed'

describe('collect indexed', () => {
	test('', () => {
		const t = { a: 1, b: 2, c: 3 }
		const res = collectIndexed(Object.entries(t))(arrayFormDest())
		expect(res).toEqual([1, 2, 3])
		expectTypeOf(res).toEqualTypeOf<number[]>()
	})
})
