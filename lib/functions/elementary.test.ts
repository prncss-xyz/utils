import { always, clamp, modulo } from './elementary'

describe('modulo', () => {
	test('', () => {
		expect(modulo(3)(1)).toBe(1)
		expect(modulo(3)(-1)).toBe(2)
	})
})

describe('clamp', () => {
	test('', () => {
		expect(clamp(1, 3)(0)).toBe(1)
		expect(clamp(1, 3)(2)).toBe(2)
		expect(clamp(1, 3)(4)).toBe(3)
		expect(clamp(2, 1)(4)).toBe(2)
	})
})

describe('always', () => {
	test('', () => {
		expect(always(3)()).toBe(3)
	})
})
