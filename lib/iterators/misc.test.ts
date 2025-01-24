import { id } from '@constellar/core'

import { arrayForm, collect } from '../collectors'
import { add, lt } from '../functions'
import { loop } from './misc'

describe('loop', () => {
	test('should loop', () => {
		const res = collect(loop(lt(5), add(1), 0), id)(arrayForm())
		expect(res).toEqual([0, 1, 2, 3, 4])
	})
})
