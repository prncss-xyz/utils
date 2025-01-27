import { sub } from '../../functions'
import { collectUnfold } from '../collectables/unfoldables'
import { arrayFormDest } from '../forms'
import { arrayColl, rangeColl } from '../unforms'
import { zip, zipCmp } from './zip-like'

describe('zip', () => {
	test('shorter, right', () => {
		const res = collectUnfold(
			rangeColl(0, 3),
			zip(rangeColl(1, 5)),
		)(arrayFormDest())
		expect(res).toEqual([
			[0, 1],
			[1, 2],
			[2, 3],
		])
	})
	test('shorter, left', () => {
		const res = collectUnfold(
			rangeColl(0, 4),
			zip(rangeColl(1, 4)),
		)(arrayFormDest())
		expect(res).toEqual([
			[0, 1],
			[1, 2],
			[2, 3],
		])
	})
})

describe('zipCmp', () => {
	test('equal', () => {
		const res = collectUnfold(
			arrayColl([0, 1, 2]),
			zipCmp(arrayColl([0, 1, 2]), sub),
		)(arrayFormDest())
		expect(res).toEqual([
			[0, 0],
			[1, 1],
			[2, 2],
		])
	})
	test('equal', () => {
		const res = collectUnfold(
			arrayColl([0, 1, 3, 3, 4]),
			zipCmp(arrayColl([0, 2, 3, 4]), sub),
		)(arrayFormDest())
		expect(res).toEqual([
			[0, 0],
			[1, undefined],
			[undefined, 2],
			[3, 3],
			[3, undefined],
			[4, 4],
		])
	})
	test('shorter, right', () => {
		const res = collectUnfold(
			rangeColl(0, 2),
			zipCmp(rangeColl(0, 3), sub),
		)(arrayFormDest())
		expect(res).toEqual([
			[0, 0],
			[1, 1],
			[undefined, 2],
		])
	})
	test('shorter, left', () => {
		const res = collectUnfold(
			rangeColl(0, 3),
			zipCmp(rangeColl(0, 2), sub),
		)(arrayFormDest())
		expect(res).toEqual([
			[0, 0],
			[1, 1],
			[2, undefined],
		])
	})
})
