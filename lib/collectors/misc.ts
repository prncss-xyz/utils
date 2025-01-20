import { id } from "@constellar/core"

export function arrayForm<T>() {
	return {
		foldFn: (t: T, acc: T[]) => (acc.push(t), acc),
		init: () => [],
	}
}

export function valueForm<T>() {
	return {
		foldFn: id<T | undefined>,
		init: () => undefined,
	}
}

export function sumForm() {
	return {
		foldFn: (t: number, acc: number) => acc + t,
		init: () => 0,
	}
}

export function joinForm(sep = '\t') {
	return {
		foldFn: (t: string, acc: string) => (acc === '' ? t : acc + sep + t),
		init: () => '',
	}
}

export function joinLastForm(sep = '\n') {
	return {
		foldFn: (t: string, acc: string) => acc + t + sep,
		init: () => '',
	}
}

export function productForm() {
	return {
		foldFn: (t: number, acc: number) => acc * t,
		init: () => 1,
	}
}
