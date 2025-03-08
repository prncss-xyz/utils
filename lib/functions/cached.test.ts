import { memo1, once0, once1 } from './cached'

describe('once0', () => {
	test('', () => {
		let i = 0
		const cb = once0(() => i++)
		expect(cb()).toBe(cb())
	})
})

describe('once1', () => {
	test('', () => {
		let i = 0
		const cb = once1((inc: number) => {
			i += inc
			return i
		})
		expect(cb(1)).toBe(1)
		expect(cb(2)).toBe(3)
		expect(cb(1)).toBe(1)
	})
})

describe('memo1', () => {
	test('', () => {
		let i = 0
		const cb = memo1((inc: number) => {
			i += inc
			return i
		})
		expect(cb(1)).toBe(1)
		expect(cb(1)).toBe(1)
		expect(cb(2)).toBe(3)
		expect(cb(1)).toBe(4)
	})
})
