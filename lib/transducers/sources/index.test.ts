import { arraySource } from '.'
import { arraySink } from '../sinks'
import { collectSink } from '../transductions/sinks'

describe('', () => {
	test('', () => {
		const r = collectSink(arraySource([1, 2, 3]))(arraySink())
		expect(r).toEqual([1, 2, 3])
	})
})
