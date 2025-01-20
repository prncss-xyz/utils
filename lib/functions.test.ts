import { focus, prop } from '@constellar/core'

import { bindMethod, converge, curry } from '.'

describe('bindMethod', () => {
	test(() => {
		const f = focus<{ x: number }>()(prop('x'))
		const t = bindMethod(f, 'view')
		expect(t({ x: 5 })).toBe(5)
	})
})

describe('curry', () => {
	test(() => {
		const f = (x: number, y: number) => x + y
		const t = curry(f)
		expect(t(5)(6)).toBe(11)
	})
})

describe('converge', () => {
	test(() => {
		const f = (x: number, y: number) => [x, y]
		const t = converge(f, [
			(x: number, y: number) => x + y,
			(x: number, y: number) => x - y,
		])
		expect(t(3, 4)).toEqual([7, -1])
	})
})
