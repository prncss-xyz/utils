import { arrayColl } from '.'
import { collectUnfold } from '../collectables/unfoldables'
import { arrayForm } from '../forms'

describe('', () => {
	test('', () => {
		const r = collectUnfold(arrayColl([1, 2, 3]))(arrayForm())
		expect(r).toEqual([1, 2, 3])
	})
})
