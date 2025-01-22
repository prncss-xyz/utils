import { Prettify } from '@constellar/core'

import { fromInit, Init } from '../functions'

export function discriminateFactory<T extends PropertyKey>(type: T) {
	return function <O extends Record<T, PropertyKey>>() {
		type Choices<R> = {
			[K in O[T]]: Init<R, [Prettify<O & Record<T, K>>]>
		}
		// strict partial
		function disc<R, C extends Partial<Choices<R>>>(
			choices: C & (C extends Choices<R> ? never : unknown),
			otherwise: Init<R, [Prettify<O & Record<T, Exclude<O[T], keyof C>>>]>,
		): (value: O) => R
		function disc<R>(choices: Choices<R>): (value: O) => R
		function disc<R>(choices: Choices<R>): (value: O) => R
		function disc<R>(
			choices: Partial<Choices<R>>,
			otherwise?: Init<R, [O]>,
		) {
			return function (value: O) {
				const choice = choices[value[type]]
				if (choice) {
					return fromInit(choice, value)
				}
				if (otherwise) fromInit(otherwise, value)
				assert(false)
			}
		}
		return disc
	}
}

export const discriminate = discriminateFactory('type')
