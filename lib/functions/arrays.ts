function cmp0<T>(a: T, b: T): number {
	return a < b ? -1 : a > b ? 1 : 0
}

export function insertCmp<T>(cmp = cmp0) {
	return function (t: T) {
		return function (acc: T[]) {
			for (let i = 0; i < acc.length; i++) {
				const v = acc[i]!
				const r = cmp(v, t)
				if (r < 0) continue
				if (r === 0) return acc
				if (r > 0) return acc.slice(0, i).concat([t], acc.slice(i))
			}
			return acc.concat(t)
		}
	}
}

export function insertValue<X>(element: X) {
	let dirty = true
	function p(x: X) {
		if (Object.is(x, element)) dirty = false
	}
	return function (xs: X[]) {
		xs.forEach(p)
		return dirty ? xs.concat(element) : xs
	}
}

export function removeValue<X>(element: X) {
	let dirty = false
	function p(x: X) {
		if (Object.is(x, element)) {
			dirty = true
			return false
		}
		return true
	}
	return function (xs: X[]) {
		const res = xs.filter(p)
		return dirty ? res : xs
	}
}

export function removeValues<X>(elements: X[]) {
	let dirty = false
	function p(x: X) {
		if (elements.includes(x)) {
			dirty = true
			return false
		}
		return true
	}
	return function (xs: X[]) {
		const res = xs.filter(p)
		return dirty ? res : xs
	}
}

export function symmetricDiff<X>(a: X[], b: X[]) {
	return [
		a.filter((x) => !b.includes(x)),
		b.filter((x) => !a.includes(x)),
	] as const
}
