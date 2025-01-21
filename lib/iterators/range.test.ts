import { arrayForm, collect } from '../collectors'
import { add, lt } from '../functions'
import { loop } from './range'

describe('loop', () => {
	test('should loop', () => {
		const res = collect(arrayForm())(loop(0, lt(5), add()))
		expect(res).toEqual([0, 1, 2, 3, 4])
	})
})
