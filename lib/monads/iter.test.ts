import { iter } from '.'
import { range } from '../iterators'
import { arraySinkDest, collect } from '../transducers'
import { multi, pick, where } from './iter'

describe('arr.chain', () => {
	test('', () => {
		function m(n: number) {
			return range(0, n)
		}
		const res = Array.from(iter.chain(m)(range(0, 4)))
		expect(res).toEqual([0, 0, 1, 0, 1, 2])
	})
})

describe('do notation', () => {
	test('right triangles', async () => {
		function rightTriangles(maxLengthC: number) {
			return multi(function* () {
				const c = yield* pick(range(1, maxLengthC + 1))
				const a = yield* pick(range(1, c))
				const b = yield* pick(range(1, a))
				yield* where(a ** 2 + b ** 2 === c ** 2)
				return [a, b, c] as const
			})
		}
		const res = collect(rightTriangles(10))(arraySinkDest())
		expect(res).toEqual([
			[4, 3, 5],
			[8, 6, 10],
		])
	})
})
