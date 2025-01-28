import { collect } from '../transductions'
import { sortedSink } from './cmp'

describe('sortedSink', () => {
	test('sortedSink', () => {
		const res = collect([0, 2, 2, 1])(sortedSink())
		expect(res).toEqual([0, 1, 2])
	})
})
