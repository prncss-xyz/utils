import { eqWith, iDiv, modulo } from '../../functions'
import { range } from '../../iterators'
import { arraySink, arraySinkDest, sumSink } from '../sinks'
import { collect } from '../transductions'
import { group, scan } from './scan-like'

describe('group', () => {
	test('default form', () => {
		const res = collect(range(0, 0), group(eqWith(iDiv(2))))(arraySinkDest())
		expect(res).toEqual([])
		expectTypeOf(res).toEqualTypeOf<number[][]>()
	})
	test('default form', () => {
		const res = collect(range(0, 6), group(eqWith(iDiv(2))))(arraySinkDest())
		expect(res).toEqual([
			[0, 1],
			[2, 3],
			[4, 5],
		])
		expectTypeOf(res).toEqualTypeOf<number[][]>()
	})
	test('arrayForm', () => {
		const res = collect(
			range(0, 6),
			group(modulo(3), arraySinkDest()),
		)(arraySinkDest())
		expect(res).toEqual([
			[0, 1, 2],
			[3, 4, 5],
		])
	})
	test('sumForm', () => {
		const res = collect(
			range(0, 6),
			group(modulo(3), sumSink()),
		)(arraySinkDest())
		expect(res).toEqual([3, 12])
		expectTypeOf(res).toEqualTypeOf<number[]>()
	})
})

describe('scan', () => {
	test('', () => {
		const res = collect(range(0, 4), scan(sumSink()))(arraySinkDest())
		expect(res).toEqual([0, 1, 3, 6])
		expectTypeOf(res).toEqualTypeOf<number[]>()
	})
	test('', () => {
		const res = collect(range(0, 4), scan(arraySink()))(arraySinkDest())
		expect(res).toEqual([[0], [0, 1], [0, 1, 2], [0, 1, 2, 3]])
		expectTypeOf(res).toEqualTypeOf<number[][]>()
	})
})
