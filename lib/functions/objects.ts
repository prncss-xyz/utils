export function merge<T extends object>(a: T, b?: Partial<T>): T {
	if (!b) return a
	const res: any = { ...a }
	for (const [key, value] of Object.entries<any>(b)) {
		if (key in res) {
			if (Array.isArray(res[key]) && Array.isArray(value)) {
				res[key] = res[key].concat(value)
				continue
			}
			if (typeof res[key] === 'object' && typeof value === 'object') {
				res[key] = merge(res[key], value)
				continue
			}
		}
		res[key] = value
	}
	for (const [key, value] of Object.entries(a)) {
		if (!(key in b)) {
			res[key] = value
		}
	}
	return res
}

export function invert<K extends PropertyKey, V extends PropertyKey>(
	o: Record<K, V>,
): Record<V, K> {
	const acc: any = {}
	for (const [k, v] of Object.entries<any>(o)) {
		acc[v as any] = k as any
	}
	return acc
}

export function invertMulti<K extends PropertyKey, V extends PropertyKey>(
	o: Record<K, V>,
): Record<V, K[]> {
	const acc: any = {}
	for (const [k, v] of Object.entries<V>(o)) {
		acc[v as any] ??= [] as K[]
		acc[v as any].push(k)
	}
	return acc
}

export function objMap<K extends string, V, T>(fn: (v: V, k: K, obj: Record<K, V>) => T) {
	return function (obj: Record<K, V>) {
		return Object.fromEntries(Object.entries<V>(obj).map(([k, v]) => [k, fn(v, k as K, obj)]))
	}
}
