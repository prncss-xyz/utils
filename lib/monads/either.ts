import { Prettify } from '@constellar/core'

import { fromInit, Init } from '../functions/arguments'
import { discriminateFactory } from '../validation/discriminate'

export function eitherFactory<T extends PropertyKey, P extends PropertyKey>(
	type: T,
	payload: Exclude<P, T>,
) {
	return function <O extends Record<P, unknown> & Record<T, PropertyKey>>() {
		function monad<const M extends O[T]>(main: M) {
			type Main<A> = Prettify<O & Record<P, A> & Record<T, M>>
			type Other = Prettify<O & Record<T, Exclude<O[T], M>>>
			type Monad<A> = Prettify<Main<A> | Other>
			function isMain<T>(a: Monad<T>): a is Main<T> {
				return a[type] === main
			}
			function isOther<T>(a: Monad<T>): a is Other {
				return a[type] !== main
			}
			function unit<T>(a: T): Main<T> {
				return { [payload]: a, [type]: main } as Main<T>
			}

			function chain<A, B>(
				cb: (a: A) => Monad<B>,
			): {
				(a: Monad<A>): Monad<B>
				(a: Other): Other
				(a: Main<A>): Main<B>
			} {
				return function (a: Monad<A>): any {
					if (isMain(a)) return cb(a[payload])
					return a
				}
			}
			function map<A, B>(
				cb: (a: A) => B,
			): {
				(a: Main<A>): Main<B>
				(a: Other): Other
				(a: Monad<A>): Monad<B>
			} {
				return function (a: Monad<A>): any {
					if (isMain(a)) return unit(cb(a[payload]))
					return a
				}
			}
			function unwrap<A>(a: Main<A>): A
			function unwrap(a: Other): undefined
			function unwrap<R>(a: Other, or: Init<R, [Other]>): R
			function unwrap<A, R>(a: Monad<A>, or: Init<R, [Other]>): A | R
			function unwrap<A>(a: Monad<A>): A | undefined
			function unwrap<A, R = undefined>(
				a: Monad<A>,
				or?: Init<R, [Other]>,
			): any {
				if (isMain(a)) return a[payload]
				return fromInit(a, or)
			}

			function arr<A>(a: Monad<A>): A[] {
				if (isMain(a)) return [a[payload]]
				return []
			}
			function form<T>(o: Other) {
				return {
					foldFn: unit as (a: T, acc: Monad<T>) => Monad<T>,
					init: () => o,
				}
			}

			return {
				arr,
				chain,
				form,
				isMain,
				isOther,
				map,
				unit,
				unwrap,
			}
		}
		return {
			discriminate: discriminateFactory(type)<O>(),
			monad,
		}
	}
}

export const either = eitherFactory('type', 'payload')
type Errable =
	| { payload: string; type: 'error' }
	| { payload: unknown; type: 'success' }
export const errable = either<Errable>()
export const suc = errable.monad('success')
export const err = errable.monad('error')
