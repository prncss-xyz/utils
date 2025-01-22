import { focus, prop } from '@constellar/core'

import { bindWith, curry, flip, fromInit, Init } from '.'

describe('fromInit', () => {
	type I = Init<number, [number, string]>
	test('with constant', () => {
		const v: I = 1
		expect(fromInit<number, [number, string]>(v, 2, 'toto')).toBe(1)
	})
	test('with function', () => {
		const f: I = (x: number, y: string) => x + y.length
		expect(fromInit<number, [number, string]>(f, 2, 'toto')).toBe(6)
	})
})

describe('curry', () => {
	test(() => {
		const f = (x: number, y: number, z: string) => x + y + z.length
		const t = curry(f)
		expect(t(5, 6, 'four')).toBe(11)
		expect(t(5)(6, 'four')).toBe(11)
		expect(t(5, 6)('four')).toBe(11)
		expect(t(5)(6)('four')).toBe(11)
	})
})

describe('bindWith', () => {
	test(() => {
		const f = focus<{ x: number }>()(prop('x'))
		const t = bindWith(f, 'view')
		expect(t({ x: 5 })).toBe(5)
	})
})

describe('flip', () => {
	test(() => {
		const flipped = flip((x: number, y: number) => x - y)
		expect(flipped(3, 4)).toBe(1)
	})
})
