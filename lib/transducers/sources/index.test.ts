import { arraySource } from '.'
import { arraySinkDest } from '../sinks'
import { collectSink } from '../transductions/sinks'

describe('', () => {
	test('', () => {
		const r = collectSink(arraySource([1, 2, 3]))(arraySinkDest())
		expect(r).toEqual([1, 2, 3])
	})
})
