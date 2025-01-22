import { modulo } from './elementary'

describe('modulo', () => {
	test('should work', () => {
		expect(modulo(3, 1)).toBe(1)
		expect(modulo(3, -1)).toBe(2)
	})
})
