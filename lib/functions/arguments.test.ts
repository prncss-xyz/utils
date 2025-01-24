import { curry, flip, fromInit, Init, sub, uncurry } from '.'

describe('uncurry', () => {
	test('', () => {
		const x = (x: number, y: number) => (z: string) => (w: boolean) =>
			x + y + z.length + (w ? 1 : 0)
		const u = uncurry(x)
		expect(u(1, 2, 'four', true)).toBe(8)
	})
	// FIXME:
	test.skip('', () => {
		const u = uncurry(sub)
		expect(u(1, 2)).toBe(1)
	})
})

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
	test('', () => {
		const f = (x: number, y: number, z: string) => x + y + z.length
		const t = curry(f)
		expect(t(5, 6, 'four')).toBe(15)
		expect(t(5)(6, 'four')).toBe(15)
		expect(t(5, 6)('four')).toBe(15)
		expect(t(5)(6)('four')).toBe(15)
	})
})

describe('flip', () => {
	test('', () => {
		const flipped = flip((x: number, y: number) => x - y)
		expect(flipped(3, 4)).toBe(1)
	})
})
