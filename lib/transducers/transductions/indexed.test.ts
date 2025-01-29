import { filter } from '../operators'
import { arraySinkDest } from '../sinks'
import { collectIndexed } from './indexed'

describe('collect indexed', () => {
	test('', () => {
		const t = { a: 1, b: 2, c: 3 }
		const res = collectIndexed(
			Object.entries(t),
			filter((t) => t % 2 === 1),
		)(arraySinkDest())
		expect(res).toEqual([1, 3])
		expectTypeOf(res).toEqualTypeOf<number[]>()
	})
})
