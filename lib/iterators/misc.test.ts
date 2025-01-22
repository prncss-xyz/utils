import { arrayForm, collect } from '../collectors'
import { add, eq, lt } from '../functions'
import { groupWith, loop } from './misc'

describe('loop', () => {
	test('should loop', () => {
		const res = collect(arrayForm())(loop(lt(5), add(1), 0))
		expect(res).toEqual([0, 1, 2, 3, 4])
	})
})

describe('groupWith', () => {
	test(() => {
		const res = collect(arrayForm())(
			groupWith(eq)([0, 1, 1, 2, 3, 5, 8, 13, 21]),
		)
		expect(res).toEqual([[0], [1, 1], [2], [3], [5], [8], [13], [21]])
	})
})
