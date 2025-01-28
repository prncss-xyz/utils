import { take } from '../operators'
import { arraySinkDest } from '../sinks'
import { collectObservable } from './observables'

describe('observable', () => {
	test('', async () => {
		let complete: (value: number[]) => void = () => {}
		const p = new Promise<number[]>((resolve) => {
			complete = resolve
		})
		const { close, next } = collectObservable<number>()(
			{ complete },
			arraySinkDest(),
			take(2),
		)
		next(1)
		next(2)
		next(3)
		close()
		const res = await p
		expect(res).toEqual([1, 2])
	})
})
