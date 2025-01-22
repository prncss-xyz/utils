import { range } from '../iterators'
import { collect } from './core'
import { scanForm } from './higher'
import { sumForm } from './misc'

describe('scanForm', () => {
	test('should cumulate results', () => {
		const f = scanForm(sumForm())
		const res = collect(f)(range(0, 4))
		expect(res).toEqual([0, 1, 3, 6])
	})
})
