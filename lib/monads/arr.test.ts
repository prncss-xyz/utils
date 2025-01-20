import { asyncCollect, collect } from '../collectors/core'
import { arrayForm } from '../collectors/misc'
import { range } from '../iterators/'
import { arr, asyncMulti, asyncPick, multi, pick, where } from './arr'

describe('arr.chain', () => {
	test(() => {
		function m(n: number) {
			return range(0, n)
		}
		const res = Array.from(arr.chain(m)(range(0, 4)))
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
		const res = collect(arrayForm())(rightTriangles(10))
		expect(res).toEqual([
			[4, 3, 5],
			[8, 6, 10],
		])
	})
})

describe('async', () => {
	async function* asyncRange(start: number, end: number) {
		for (let i = start; i < end; i++) {
			yield i
		}
	}
	test('async with sync', async () => {
		async function rightTriangles(maxLengthC: number) {
			return asyncMulti(async function* () {
				const c = yield* asyncPick(asyncRange(1, maxLengthC + 1))
				const a = yield* pick(range(1, c))
				const b = yield* asyncPick(asyncRange(1, a))
				yield* where(a ** 2 + b ** 2 === c ** 2)
				return [a, b, c] as const
			})
		}
		const res = await asyncCollect(arrayForm())(rightTriangles(10))
		expect(res).toEqual([
			[4, 3, 5],
			[8, 6, 10],
		])
	})
})
