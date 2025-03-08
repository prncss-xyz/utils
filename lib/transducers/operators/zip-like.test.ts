import { sub } from '../../functions'
import { arraySinkDest } from '../sinks'
import { arraySource, rangeSource } from '../sources'
import { collectSink } from '../transductions/sinks'
import { concat, zip, zipCmp } from './zip-like'

describe('zip', () => {
	test('shorter, right', () => {
		const res = collectSink(
			rangeSource(0, 3),
			zip(rangeSource(1, 5)),
		)(arraySinkDest())
		expect(res).toEqual([
			[0, 1],
			[1, 2],
			[2, 3],
		])
	})
	test('shorter, left', () => {
		const res = collectSink(
			rangeSource(0, 4),
			zip(rangeSource(1, 4)),
		)(arraySinkDest())
		expect(res).toEqual([
			[0, 1],
			[1, 2],
			[2, 3],
		])
	})
})

describe('zipCmp', () => {
	test('equal', () => {
		const res = collectSink(
			arraySource([0, 1, 2]),
			zipCmp(arraySource([0, 1, 2]), sub),
		)(arraySinkDest())
		expect(res).toEqual([
			[0, 0],
			[1, 1],
			[2, 2],
		])
	})
	test('equal', () => {
		const res = collectSink(
			arraySource([0, 1, 3, 3, 4]),
			zipCmp(arraySource([0, 2, 3, 4]), sub),
		)(arraySinkDest())
		expect(res).toEqual([
			[0, 0],
			[1, undefined],
			[undefined, 2],
			[3, 3],
			[3, undefined],
			[4, 4],
		])
	})
	test('shorter, right', () => {
		const res = collectSink(
			rangeSource(0, 2),
			zipCmp(rangeSource(0, 3), sub),
		)(arraySinkDest())
		expect(res).toEqual([
			[0, 0],
			[1, 1],
			[undefined, 2],
		])
	})
	test('shorter, left', () => {
		const res = collectSink(
			rangeSource(0, 3),
			zipCmp(rangeSource(0, 2), sub),
		)(arraySinkDest())
		expect(res).toEqual([
			[0, 0],
			[1, 1],
			[2, undefined],
		])
	})
})

describe('concat', () => {
	test('shorter, right', () => {
		const res = collectSink(
			rangeSource(0, 3),
			concat(arraySource(['a', 'b'])),
		)(arraySinkDest())
		expect(res).toEqual([0, 1, 2, 'a', 'b'])
	})
	test('shorter, left', () => {
		const res = collectSink(
			rangeSource(0, 4),
			zip(rangeSource(1, 4)),
		)(arraySinkDest())
		expect(res).toEqual([
			[0, 1],
			[1, 2],
			[2, 3],
		])
	})
})

/*
describe('zip, async', () => {
	test('shorter, right', async () => {
		let completeRight: (value: number[]) => void = () => {}
		const pRight = new Promise<number[]>((resolve) => {
			completeRight = resolve
		})
		let completeLeft: (value: [number, number][]) => void = () => {}
		const pLeft = new Promise<[number, number][]>((resolve) => {
			completeLeft = resolve
		})
		const { close: closeLeft, next: nextLeft } = collectObservable<number>()(
			{ complete: completeLeft },
			arrayFormDest(),
			zip(rangeColl(0, 2)),
		)
		nextLeft(1)
		nextRight(0)
		nextLeft(2)
		nextLeft(3)
		closeLeft()
		const res = await pLeft

		expect(res).toEqual([
			[1, 0],
			[2, 1],
		])
	})
})
*/
