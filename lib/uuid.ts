import { customAlphabet } from 'nanoid/non-secure'

// mostly base64, with `-` and `_` instead of `/` and `+` to be make it usable as a filename or a url
const base64 =
	'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'
const seqN = 3 // number of characters in the sequential part of the UUID
const seqMax = base64.length ** seqN // max value for the sequential part

function encode(n: number) {
	let acc = ''
	while (n > 0) {
		acc = base64[n % base64.length] + acc
		n = Math.floor(n / base64.length)
	}
	while (acc.length < seqN) {
		acc = base64[0] + acc
	}
	return acc
}

const rand = customAlphabet(base64, 12)

function getFactory() {
	let count = Math.floor(Math.random() * seqMax)
	return function () {
		count++
		if (count >= seqMax) count = 0
		return  encode(count) + rand()
	}
}

export const createUUID = getFactory()
