import { add, converge, juxt, lt, report, sub, thrush } from '.'

describe('converge', () => {
	test(() => {
		const t = converge(
			(x: number, y: number, z: string) => x + y + z.length,
			sub,
		)((x, y) => [x, y] as const)
		expect(t(3, 4, 'four')).toEqual([11, 1])
	})
})

describe('juxt', () => {
	test('get range', () => {
		const t = juxt(Math.min, Math.max)
		expect(t(3, 4, 9, -3)).toEqual([-3, 9])
	})
})

describe('thrush', () => {
	test(() => {
		const t = thrush(3)
		expect(t(sub(1))).toEqual(2)
	})
})

describe('report', () => {
	test(() => {
		const t = report<number>()(
			{
				add: add(1),
				lt: lt(2),
			},
		)
    expect(true).toBe(false)
		expect(t(0)).toEqual({ add: 1, sub: true })
	})
})
