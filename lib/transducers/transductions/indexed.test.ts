import { arraySinkDest } from '../sinks'
import { collectIndexed } from './indexed'

describe('collect indexed', () => {
	test('', () => {
		const t = { a: 1, b: 2, c: 3 }
		const res = collectIndexed(Object.entries(t))(arraySinkDest())
		expect(res).toEqual([1, 2, 3])
		expectTypeOf(res).toEqualTypeOf<number[]>()
	})
})
