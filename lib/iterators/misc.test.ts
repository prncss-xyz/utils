import { id } from '@constellar/core'

import { add, lt } from '../functions'
import { arraySinkDest } from '../transducers/sinks'
import { collect } from '../transducers/transductions'
import { loop } from './misc'

describe('loop', () => {
	test('should loop', () => {
		const res = collect(loop(lt(5), add(1), 0), id)(arraySinkDest())
		expect(res).toEqual([0, 1, 2, 3, 4])
	})
})
