import { discriminate } from './discriminate'

describe('discriminate', () => {
	test('without default', () => {
		type V =
			| { a: number; type: 'a' }
			| { b: string; type: 'b' }
			| { c: number; type: 'c' }
		const disc = discriminate<V>()({
			a: ({ a }) => a as number | string,
			b: ({ b }) => b,
			c: () => 0,
		})
		expectTypeOf(disc).returns.toEqualTypeOf<number | string>()
		expect(disc({ b: 'toto', type: 'b' })).toEqual('toto')
	})
	test('with default', () => {
		type V =
			| { a: number; type: 'a' }
			| { b: string; type: 'b' }
			| { c: number; type: 'c' }

		const disc = discriminate<V>()(
			{
				a: ({ a }) => a * 3,
				b: ({ b }) => b.length,
			},
			undefined as number | undefined,
		)
		expectTypeOf(disc).returns.toEqualTypeOf<number | undefined>()
		expect(disc({ a: 6, type: 'a' })).toEqual(18)
		expect(disc({ b: 'toto', type: 'b' })).toEqual(4)
	})
})
