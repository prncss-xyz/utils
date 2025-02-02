import { flow } from '@constellar/core'

import { asyncIter, iter } from '.'
import { mul } from '../functions'
import { range } from '../iterators'
import { arraySinkDest, asyncCollect } from '../transducers'

describe('async', () => {
	async function* asyncRange(start: number, end: number) {
		for (let i = start; i < end; i++) {
			yield i
		}
	}
	test('async with sync', async () => {
		async function rightTriangles(maxLengthC: number) {
			return asyncIter.multi(async function* () {
				const c = yield* asyncIter.pick(asyncRange(1, maxLengthC + 1))
				const a = yield* iter.pick(range(1, c))
				const b = yield* asyncIter.pick(asyncRange(1, a))
				yield* iter.where(a ** 2 + b ** 2 === c ** 2)
				return [a, b, c] as const
			})
		}
		const res = await asyncCollect(rightTriangles(10))(arraySinkDest())
		expect(res).toEqual([
			[4, 3, 5],
			[8, 6, 10],
		])
	})
})

describe('asyncIter', () => {
	test('map', async () => {
		async function* asyncRange(start: number, end: number) {
			for (let i = start; i < end; i++) {
				yield i
			}
		}
		const res = await flow(
			asyncRange(0, 4),
			asyncIter.map(mul(2)),
			asyncIter.collect(arraySinkDest()),
		)
		expect(res).toEqual([0, 2, 4, 6])
	})
	test('chain', async () => {
		async function* asyncRange(start: number, end: number) {
			for (let i = start; i < end; i++) {
				yield i
			}
		}
		const res = await asyncCollect(
			flow(
				asyncRange(0, 4),
				asyncIter.chain((x) => asyncRange(0, x)),
			),
		)(arraySinkDest())
		expect(res).toEqual([0, 0, 1, 0, 1, 2])
	})
})
